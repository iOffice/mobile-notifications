var count = 0;

document.querySelector('#default').addEventListener('click', function(e) {
  new Notification('This is a default notification: ' + (++count), {
    tapToClose: true
  });
});