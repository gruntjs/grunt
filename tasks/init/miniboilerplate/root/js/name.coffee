#
# Name        : {%= name %}
# Description : {%= description %}
# Author      : {%= author_name %}, {%= author_email %}
# Version     : {%= version %}
# Repo        : {%= repository %}
# Website     : {%= homepage %}
#

jQuery ->
  $.{%= name %} = ( element, options ) ->
    # current state
    state = ''

    # plugin settings
    @settings = {}

    # jQuery version of DOM element attached to the plugin
    @$element = $ element

    # set current state
    @setState = ( _state ) -> state = _state

    #get current state
    @getState = -> state

    # get particular plugin setting
    @getSetting = ( key ) ->
      @settings[ key ]

    # call one of the plugin setting functions
    @callSettingFunction = ( name, args = [] ) ->
      @settings[name].apply( this, args )

    @init = ->
      @settings = $.extend( {}, @defaults, options )

      @setState 'ready'

    # initialise the plugin
    @init()

    # make the plugin chainable
    this

  # default plugin settings
  $.{%= name %}::defaults =
      message: 'hello word'  # option description

  $.fn.{%= name %} = ( options ) ->
    this.each ->
      if $( this ).data( '{%= name %}' ) is undefined
        plugin = new $.{%= name %}( this, options )
        $( this).data( '{%= name %}', plugin )