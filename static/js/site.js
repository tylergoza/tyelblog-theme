'use strict';
window.currentlyReading = null;

function toggleCurrentlyReading(el) {
  event.preventDefault()
  
  Array.prototype.forEach.call(el.parentElement.parentElement.children, function (child) {
    if (child.tagName.toLowerCase() === 'section' && child.className.search('content') >= 0) {
     if (child.className.search('hidden') >= 0) {
       child.className = child.className.replace(/hidden/g, '')
       el.parentElement.parentElement.className = el.parentElement.parentElement.className.replace(/no-print/g, '')
       el.innerHTML = 'Read less...'
       window.currentlyReading = el
      }
      else {
        child.className = child.className.concat(' ', 'hidden')
        el.parentElement.parentElement.className = el.parentElement.parentElement.className.concat(' ', 'no-print')
        el.innerHTML = 'Read more...'
        el.dataset.isOpen = false
        window.currentlyReading = null
      }
    }
  })
}

function readMore(el) {
  if (!currentlyReading) {
    return toggleCurrentlyReading(el)
  }
  if (currentlyReading && currentlyReading === el) {
    return toggleCurrentlyReading(el)
  }
  else {
    toggleCurrentlyReading(currentlyReading)
    return toggleCurrentlyReading(el)
  }
}

function calculateReadingTime(article) {
  var avgWPS = Math.round(265 / 60)
  var totalReadingSeconds = 0
  var wordCount = Array.prototype.map.call(article.querySelectorAll('section'), function (section) {
    var words = 0

    Array.prototype.forEach.call(section.querySelectorAll('p'), function (p) {
      words += p.innerText.split(' ').length
    })
    Array.prototype.forEach.call(section.querySelectorAll('h3'), function (h3) {
      words += h3.innerText.split(' ').length
    })
    return words
  }).reduce(function (acc, current) { 
    return acc + current
  }, 0)
  totalReadingSeconds = Math.round(wordCount / avgWPS)
  
  if (totalReadingSeconds >= 60) {
    return `${Math.round(totalReadingSeconds / 60)} min Read Time, ${wordCount} words`
  }
  return `${totalReadingSeconds} sec Read Time, ${wordCount} words`
}

window.onload = function () {
  Array.prototype.forEach.call(document.querySelectorAll('.reading-time'), function (el) {
    el.innerText = calculateReadingTime(el.parentElement.parentElement.parentElement)
  })

  htmx.onLoad(function (t) {
    window.scrollTo(0,0)
  })
}