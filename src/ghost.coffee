$ ->

  # Namespace for application-wide variables
  app =
    context: new webkitAudioContext()
    metronome: new Metronome(140, 4)
    buffers: []

  # DOM Templates to be inserted dynamically
  trackTemplate = """
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
            <input type="text" class="track-input" value=".." maxlength="2">
          </td>
          <td class="sc-pan">
            <input type="text" class="track-input" value=".." maxlength="2">
          </td>
        </tr>
      <% } %>
    </table>
  """

  rulerTemplate = """
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
  """

  ## Track classes

  class Track extends Backbone.Model

    defaults: ->
      gainNode = app.context.createGainNode()
      panNode = app.context.createPanner()
      panNode.panningModel = webkitAudioPannerNode.EQUALPOWER

      gainNode.connect panNode
      panNode.connect app.context.destination

      hitlist: {}
      panNode: panNode
      gainNode: gainNode

  class TrackView extends Backbone.View

    tagName: 'li'
    template: _.template trackTemplate

    initialize: ->
      @render()

    render: ->
      @$el.html @template
        title: @model.get 'title'
      $('#track-list').append @el

    # Keypress event handler on note-column cells. I'd like to work the MIDI
    # api into here like a real tracker.
    noteHandle: (e) ->
      return false if not app.activeBuffer?
      idx = app.buffers.indexOf(app.activeBuffer) + 1
      $(e.target).val "C.0#{idx}"
      @updateHit e

    # Update the hit registered to a given tick on a given track
    # Probably could be much more efficient...
    updateHit: (e) ->
      line = $(e.target).closest('tr').index() - 1
      hitlist = @model.get 'hitlist'
      # Remove listener if already exists
      app.metronome.removeListener "t#{line}", hitlist[line] if hitlist[line]?
      # Hit gain
      gain = parseFloat @$el.find("tr:nth-child(#{line+2}) .sc-gain input").val()
      gain = if _.isNaN gain then 1.0 else gain / 80
      # Hit panning - potential bug in web audio api? try playing two samples
      # quickly at pan 80 and pan 0, respectively. The panner doesn't go all
      # the way right->left, goes more right->middle.
      pan = parseFloat @$el.find("tr:nth-child(#{line+2}) .sc-pan input").val()
      pan = if _.isNaN pan then 0.0 else ((pan - 40.0) / 80)
      # Need a reference to this event listener so to remove it later
      noteString = @$el.find("tr:nth-child(#{line+2}) .sc-note input").val()
      bufferIndex = (parseInt noteString.split('.')[1]) - 1
      buffer = app.buffers[bufferIndex]
      hitlist[line] = do () =>
        () => @fire
          buffer: buffer
          gain: gain
          pan: pan
      app.metronome.addListener "t#{line}", hitlist[line]

    fire: (hit) ->
      @node = app.context.createBufferSource()
      @node.buffer = hit.buffer
      @node.connect @model.get 'gainNode'
      @model.get('gainNode').gain.value = hit.gain
      @model.get('panNode').setPosition hit.pan, 0, .1
      @node.noteOn 0

    events:
      'keypress .sc-note > input': 'noteHandle'
      'change .sc-gain > input': 'updateHit'
      'change .sc-pan > input': 'updateHit'

  ## Build the editor

  # Attach the line ruler
  $('#track-list').append _.template rulerTemplate, {}

  # Attach 8 tracks
  for number in [0..7]
    new TrackView
      model: new Track
        title: "Track 0#{number}"

  # Apply beat accent markers. By default, 4 lines per beat
  $('.track tr:nth-child(4n + 2)').addClass 'beatAccent'

  ## User interface event bindings 

  # Update the metronome bpm
  $('#bpm-control input').on 'change', ->
    v = parseInt $(@).val()
    app.metronome.setBPM v if 30 < v < 499

  # Update the resolution of the metronome, reapply the beat accent markers
  $('#lpb-control input').on 'change', ->
    v = parseInt $(@).val()
    if v < 1 or v > 16
      $(@).val app.metronome.res
      return false
    app.metronome.setResolution v
    $('.beatAccent').removeClass 'beatAccent'
    $(".track tr:nth-child(#{v}n + 2)").addClass 'beatAccent'

  # Load sample prompt
  $('#new-sample').on 'click', ->
    # Make this cooler? Prompts are so 2000
    url = prompt('Enter resource url:')
    name = prompt('Sample name?')

    request = new XMLHttpRequest()
    request.open 'get', url, true
    request.responseType = 'arraybuffer'
    request.onload = ->
      app.context.decodeAudioData request.response, (buffer) ->
        app.buffers.push(buffer)
        $('#sample-select').append """
          <option value="#{app.buffers.length - 1}">
            #{name}
          </option>
        """
    request.send()

  # Mark the active buffer / instrument.
  $('#sample-select').on 'change', ->
    index = parseInt $(@).val()
    app.activeBuffer = if _.isNaN index then null else app.buffers[index]

  # Select all of the text within an input on focus.
  $('input:not([readonly])').on 'focus', ->
    that = $(@)
    that.select()
    # Focus event fires early in webkit
    setTimeout ( () -> that.select() ) , 0
    # Mouseup event unselects the text sometimes. This stops that
    that.mouseup ->
      that.unbind 'mouseup'
      return false

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

