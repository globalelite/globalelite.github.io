input_rand_era_name = (fn) ->
  era_name = era_name_list[Math.floor(Math.random() * era_name_list.length)]
  top = Math.random() * 100
  left = Math.random() * 100
  fontSize = 1 + Math.random() * 10
  $('<span>').addClass('era-name').css(
    top: "#{top}%"
    left: "#{left}%"
    fontSize: "#{fontSize}em"
  ).appendTo('.bg-era-names').jatyping(
    [[[era_name[0]], [[era_name[1]]]]]
    ->
      $(this).find('.jatyping-caret').css('visibility', 'hidden')
      $(this).addClass('era-name-fadeout')
      setTimeout =>
        $(this).remove()
      , 4000
      fn()
      return
    removeSpeed: 10
    typeSpeed: 40
    typeStartSpeed: 40
    convertSpeed: 40
    convertJumpSpeed: 50
  )
  return

set_input_rand_era_name = (ms) ->
  setTimeout ->
    input_rand_era_name ->
      set_input_rand_era_name(1000 * Math.floor(Math.random() * 5 + 1))
      return
    return
  , ms
  return

$ ->
  set_input_rand_era_name(i * 1000) for i in [0...3]
  return
