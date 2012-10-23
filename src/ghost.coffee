$ ->

  # Namespace for application-wide variables
  app =
    context: new webkitAudioContext()
    metronome: new Metronome(140, 4)
    buffers: []

  # DOM Templates to be inserted dynamically
  trackTemplate = '''
    <table class="track">
      <tr>
        <td class="title-cell" colspan=3>
          <%= title %>
        </td>
      </tr>
      <% for (var i = 0; i < 64; i++) { %>
        <tr>
          <td class="sc-note">
            <input type="text" class="track-input" value="...." readonly>
          </td>
          <td class="sc-gain">
            <input type="text" class="track-input" value="80" readonly>
          </td>
          <td class="sc-pan">
            <input type="text" class="track-input" value="80" readonly>
          </td>
        </tr>
      <% } %>
    </table>
  '''

  rulerTemplate = '''
    <li>
      <table class="track">
      <tr>
        <td class="title-cell">&nbsp;</td>
      </tr>
      <% for (var i = 0; i < 64; i++) { %>
        <tr>
          <td class="sc-gain ruler-cell">
            <%= (i < 10) ? "0" + i : i %>
          </td>
        </tr>
        <% } %>
      </table>
    </li>
  '''

  # Track model
  class Track extends Backbone.Model
    defaults: ->
      eventList: {}

  class TrackView extends Backbone.View
    tagName: 'li'
    template: _.template trackTemplate
    initialize: -> @render()
    render: ->
      @$el.html @template
        title: @model.get 'title'
      $('ul').append @el
    keyHandle: (e) ->
      console.log 'hi'
      console.log @model
      return false if not app.activeBuffer?
      idx = app.buffers.indexOf(app.activeBuffer) + 1
      label = "C.0#{idx}"
      line = $(e.target).closest('tr').index() - 1
      eventList = @model.get 'eventList'
      buffer = app.activeBuffer

      if eventList[line]?
        console.log eventList[line]
        app.metronome.removeListener "t#{line}", eventList[line]
      eventList[line] = do (buffer = app.activeBuffer) =>
        () => @fire buffer
      app.metronome.addListener "t#{line}", eventList[line]
      $(e.target).val label
    fire: (buffer) ->
      @node = app.context.createBufferSource()
      @node.buffer = buffer
      @node.connect app.context.destination
      @node.noteOn 0
    events:
      'keypress .sc-note > input': 'keyHandle'

  # Build the editor
  $('ul').append _.template rulerTemplate, {}
  for number in [0..7]
    new TrackView
      model: new Track
        title: "Track 0#{number}"
  $('.track tr:nth-child(4n + 2)').addClass 'beatAccent'

  # Bind user interface events
  $('#bpm-control input').on 'change', ->
    v = parseInt $(@).val()
    app.metronome.setBPM v if 30 < v < 499

  $('#lpb-control input').on 'change', ->
    v = parseInt $(@).val()
    if v < 1 or v > 16
      $(@).val app.metronome.res
      return false
    app.metronome.setResolution v
    $('.beatAccent').removeClass 'beatAccent'
    $(".track tr:nth-child(#{v}n + 2)").addClass 'beatAccent'

  $('#sample-load').on 'change', ->
    url = $(@).val()
    parts = url.split('/')
    name = parts[parts.length - 1]
    $(@).val('')

    request = new XMLHttpRequest()
    request.open 'get', url, true
    request.responseType = 'arraybuffer'
    request.onload = ->
      app.context.decodeAudioData request.response, (buffer) ->
        app.buffers.push(buffer)
        $('.instrument-panel ol').append """
          <li data-bufferindex="#{app.buffers.length - 1}">
            #{name}
          </li>
        """
    request.send()

  $('.instrument-panel ol').on 'click', 'li', ->
    index = parseInt $(@).data 'bufferindex'
    app.activeBuffer = app.buffers[index]
    $(@).parent().children().removeClass 'active'
    $(@).addClass 'active'

  ## Key bindings

  # Space bar starts and stops the metronome
  spaceToggle = false
  Mousetrap.bind 'space', (e) ->
    e.preventDefault()
    if spaceToggle
      app.metronome.stop()
    else
      app.metronome.startFrom(0)
      app.metronome.start()
    spaceToggle = not spaceToggle

