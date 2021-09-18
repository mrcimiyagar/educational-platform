const publicVapidKey =
  'BNgD5u59pcsAJKNff5A8Wjw0sB-TKSmhfkXxLluZAB_ieQGTQdYDxG81EEsPMA_mzNN6GfWUS8XEMW6FOttCC8s'

// Check for service worker
if ('serviceWorker' in navigator) {
  send().catch((err) => console.error(err))
}

// Register SW, Register Push, Send Push
async function send() {
  // Register Service Worker
  console.log('Registering service worker...')

  navigator.serviceWorker
    .register('http://localhost:2002/serviceWorker.js', { scope: '/' })
    .then(
      function (reg) {
        var serviceWorker
        let callback = async () => {
          console.log('Service Worker Registered...')

          // Register Push
          console.log('Registering Push...')
          const subscription = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
          })
          console.log('Push Registered...')

          // Send Push Notification
          console.log('Sending Push...')
          await fetch('https://backend.kaspersoft.cloud/subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
              'content-type': 'application/json',
              'token': localStorage.getItem('token')
            },
          })
          console.log('Push Sent...')
        }
        if (reg.installing) {
          serviceWorker = reg.installing
          // console.log('Service worker installing');
        } else if (reg.waiting) {
          serviceWorker = reg.waiting
          // console.log('Service worker installed & waiting');
        } else if (reg.active) {
          serviceWorker = reg.active
          // console.log('Service worker active');
        }

        if (serviceWorker) {
          console.log('sw current state', serviceWorker.state)
          if (serviceWorker.state == 'activated') {
            //If push subscription wasnt done yet have to do here
            console.log('sw already activated - Do watever needed here')

            callback();
          }
          serviceWorker.addEventListener('statechange', async function (e) {
            console.log('sw statechange : ', e.target.state)
            if (e.target.state == 'activated') {
              // use pushManger for subscribing here.
              console.log(
                'Just now activated. now we can subscribe for push notification',
              )

              callback();
            }
          })
        }
      },
      function (err) {
        console.error('unsuccessful registration with ', err)
      },
    )
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
