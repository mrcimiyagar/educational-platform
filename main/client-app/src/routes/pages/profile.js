import { Avatar, Card, Dialog, Fab, IconButton, Slide } from '@material-ui/core'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import EditIcon from '@material-ui/icons/Edit'
import GroupAddIcon from '@material-ui/icons/GroupAdd'
import SearchIcon from '@material-ui/icons/Search'
import React, { useEffect } from 'react'
import {
  gotoPage,
  isDesktop,
  isMobile,
  isTablet,
  popPage,
  registerDialogOpen,
  setInTheGame,
} from '../../App'
import ProfileAvatar from '../../images/avatar.jpg'
import header from '../../images/profile-header.jpeg'
import { token } from '../../util/settings'
import { serverRoot } from '../../util/Utils'
import './profile.css'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function Profile(props) {

  const urlSearchParams = new URLSearchParams(window.location.search);
  props = Object.fromEntries(urlSearchParams.entries());
  
  document.documentElement.style.overflowY = 'hidden'

  const [open, setOpen] = React.useState(true)
  registerDialogOpen(setOpen)

  const handleClose = () => {
    setOpen(false)
    setTimeout(popPage, 250)
  }

  useEffect(() => {
    setInTheGame(true);
  }, [])

  if (isDesktop() || isTablet()) {
    return (
      <Dialog
        onTouchStart={(e) => {
          e.stopPropagation()
        }}
        PaperProps={{
          style: {
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(15px)',
            borderRadius: 24,
            boxShadow: 'none',
          },
        }}
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <div style={{ width: 500, height: 650,
              overflow: 'hidden'}}>
          <div
            style={{
              zIndex: -1,
              position: 'relative',
              width: '200%',
              height: '100%',
              transform: 'rotate(12.5deg)',
              clipPath: 'inset(10px 20px 30px 40px)',
              marginTop: -200,
              marginLeft: -200,
              marginRight: 0,
              overflow: 'hidden'
            }}
          >
            <img
              src={header}
              alt=""
              style={{
                marginTop: 200,
                width: '100%',
                height: '100%',
                transform: 'rotate(-12.5deg)',
              }}
            />
          </div>

          <div style={{ width: '100%', position: 'absolute', left: -32, top: 16 }}>
              <IconButton
                style={{
                  width: 32,
                  height: 32,
                  position: 'absolute',
                  right: -16,
                }}
                onClick={handleClose}
              >
                <ArrowForwardIcon style={{ fill: '#fff' }} />
              </IconButton>
              <IconButton
                style={{
                  width: 32,
                  height: 32,
                  position: 'absolute',
                  left: 48,
                }}
              >
                <SearchIcon style={{ fill: '#fff' }} />
              </IconButton>
              <IconButton
                style={{
                  width: 32,
                  height: 32,
                  position: 'absolute',
                  left: 84,
                }}
                onClick={() => {
                  gotoPage('/app/spaces_list', {room_id: props.room_id, user_id: props.user_id});
                }}
              >
                <GroupAddIcon style={{ fill: '#fff' }} />
              </IconButton>
            </div>

            <div
              style={{
                color: '#fff',
                position: 'absolute',
                right: 16,
                top: 64,
                justifyContent: 'center',
                textAlign: 'center',
                fontWeight: 'bolder',
                fontSize: 22,
                borderRadius: 16,
                background: 'rgba(0, 0, 0, 0.25)',
                paddingLeft: 12,
                paddingRight: 12
              }}
            >
              کیهان محمدی
            </div>

            <div
            style={{
              width: 'auto',
              height: 40,
              marginTop: -112,
              display: 'flex',
              flexWrap: 'wrap',
              direction: 'rtl',
              position: 'absolute',
              right: 16,
              top: 224,
            }}
          >
            <div
              style={{
                color: '#fff',
                marginLeft: 12,
                justifyContent: 'center',
                textAlign: 'center',
                marginTop: 12,
                fontSize: 18,
                background: 'rgba(0, 0, 0, 0.25)',
                borderRadius: 20,
                paddingLeft: 8,
                paddingRight: 8,
                paddingTop: 4,
                paddingBottom: 4,
              }}
            >
              تگ تگ
            </div>
            <div
              style={{
                color: '#fff',
                marginLeft: 12,
                justifyContent: 'center',
                textAlign: 'center',
                marginTop: 12,
                fontSize: 18,
                background: 'rgba(0, 0, 0, 0.25)',
                borderRadius: 20,
                paddingLeft: 8,
                paddingRight: 8,
                paddingTop: 4,
                paddingBottom: 4,
              }}
            >
              تگ تگ تگ
            </div>
            <div
              style={{
                color: '#fff',
                marginLeft: 12,
                justifyContent: 'center',
                textAlign: 'center',
                marginTop: 12,
                fontSize: 18,
                background: 'rgba(0, 0, 0, 0.25)',
                borderRadius: 20,
                paddingLeft: 8,
                paddingRight: 8,
                paddingTop: 4,
                paddingBottom: 4,
              }}
            >
              تگ تگ
            </div>
            <div
              style={{
                color: '#fff',
                marginLeft: 12,
                justifyContent: 'center',
                textAlign: 'center',
                marginTop: 12,
                fontSize: 18,
                background: 'rgba(0, 0, 0, 0.25)',
                borderRadius: 20,
                paddingLeft: 8,
                paddingRight: 8,
                paddingTop: 4,
                paddingBottom: 4,
              }}
            >
              تگ تگ
            </div>
          </div>

          <Card
            style={{
              borderRadius: 56,
              backgroundColor: '#666',
              padding: 4,
              width: 112,
              height: 112,
              position: 'absolute',
              right: 32,
              top: 388
            }}
          >
            <Avatar
              style={{ width: '100%', height: '100%' }}
              src={ProfileAvatar}
            />
          </Card>

          <Fab
            color={'secondary'}
            style={{ marginLeft: 32, position: 'absolute', top: 348 }}
            onClick={() => {
              let requestOptions = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  token: token,
                },
                body: JSON.stringify({
                  spaceId: null,
                  name: '',
                  participentId: props.user_id,
                }),
                redirect: 'follow',
              }
              fetch(serverRoot + '/room/create_room', requestOptions)
                .then((response) => response.json())
                .then((result) => {
                  console.log(JSON.stringify(result))
                  if (result.room !== undefined) {
                    gotoPage('/app/home', {
                      user_id: props.user_id,
                      room_id: result.room.id,
                    })
                  }
                })
                .catch((error) => console.log('error', error))
            }}
          >
            <EditIcon />
          </Fab>
          <div
            style={{
              width: '100%',
              position: 'absolute',
              top: 408,
              right: 250,
              display: 'flex',
              direction: 'rtl',
            }}
          >
            <div
              style={{
                color: '#fff',
                marginLeft: 12,
                justifyContent: 'center',
                textAlign: 'center',
                marginTop: 12,
                fontSize: 18,
                borderRadius: 20,
                padding: 8,
              }}
            >
              <div
                style={{
                  color: '#fff',
                  justifyContent: 'center',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 18,
                  marginTop: -4,
                }}
              >
                10
              </div>
              <div
                style={{
                  color: '#fff',
                  justifyContent: 'center',
                  textAlign: 'center',
                  fontWeight: 'bolder',
                  fontSize: 16,
                }}
              >
                دوستان
              </div>
            </div>
            <div
              style={{
                marginRight: 12,
                color: '#fff',
                marginLeft: 12,
                justifyContent: 'center',
                textAlign: 'center',
                marginTop: 12,
                fontSize: 18,
                borderRadius: 20,
                padding: 8,
              }}
            >
              <div
                style={{
                  color: '#fff',
                  justifyContent: 'center',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 18,
                  marginTop: -4,
                }}
              >
                25
              </div>
              <div
                style={{
                  color: '#fff',
                  justifyContent: 'center',
                  textAlign: 'center',
                  fontWeight: 'bolder',
                  fontSize: 16,
                }}
              >
                بات ها
              </div>
            </div>
          </div>
          <div
            style={{
              width: 'calc(100% - 32px)',
              height: 'auto',
              zIndex: 2,
              paddingLeft: 24,
              direction: 'rtl',
              position: 'absolute',
              top: 538,
              color: '#fff',
              alignText: 'right',
            }}
          >
            لورم ایپسوم یا طرح‌نما (به انگلیسی: Lorem ipsum) به متنی آزمایشی و
            بی‌معنی در صنعت چاپ، صفحه‌آرایی و طراحی گرافیک گفته می‌شود. طراح
            گرافیک از این متن به عنوان عنصری از ترکیب بندی برای پر کردن صفحه و
            ارایه اولیه شکل ظاهری و کلی طرح سفارش گرفته شده استفاده می نماید، تا
            از نظر گرافیکی نشانگر چگونگی نوع و اندازه فونت و ظاهر متن باشد.
            معمولا طراحان گرافیک برای صفحه‌آرایی، نخست از متن‌های آزمایشی و
            بی‌معنی استفاده می‌کنند تا صرفا به مشتری یا صاحب کار خود نشان دهند
            که صفحه طراحی یا صفحه بندی شده بعد از اینکه متن در آن قرار گیرد
            چگونه به نظر می‌رسد و قلم‌ها و اندازه‌بندی‌ها چگونه در نظر گرفته
            شده‌است. از آنجایی که طراحان عموما نویسنده متن نیستند و وظیفه رعایت
            حق تکثیر متون را ندارند و در همان حال کار آنها به نوعی وابسته به متن
            می‌باشد آنها با استفاده از محتویات ساختگی، صفحه گرافیکی خود را
            صفحه‌آرایی می‌کنند تا مرحله طراحی و صفحه‌بندی را به پایان برند. لورم
            ایپسوم یا طرح‌نما (به انگلیسی: Lorem ipsum) به متنی آزمایشی و
            بی‌معنی در صنعت چاپ، صفحه‌آرایی و طراحی گرافیک گفته می‌شود. طراح
            گرافیک از این متن به عنوان عنصری از ترکیب بندی برای پر کردن صفحه و
            ارایه اولیه شکل ظاهری و کلی طرح سفارش گرفته شده استفاده می نماید، تا
            از نظر گرافیکی نشانگر چگونگی نوع و اندازه فونت و ظاهر متن باشد.
            معمولا طراحان گرافیک برای صفحه‌آرایی، نخست از متن‌های آزمایشی و
            بی‌معنی استفاده می‌کنند تا صرفا به مشتری یا صاحب کار خود نشان دهند
            که صفحه طراحی یا صفحه بندی شده بعد از اینکه متن در آن قرار گیرد
            چگونه به نظر می‌رسد و قلم‌ها و اندازه‌بندی‌ها چگونه در نظر گرفته
            شده‌است. از آنجایی که طراحان عموما نویسنده متن نیستند و وظیفه رعایت
            حق تکثیر متون را ندارند و در همان حال کار آنها به نوعی وابسته به متن
            می‌باشد آنها با استفاده از محتویات ساختگی، صفحه گرافیکی خود را
            صفحه‌آرایی می‌کنند تا مرحله طراحی و صفحه‌بندی را به پایان برند.
          </div>
        </div>
      </Dialog>
    )
  } else {
    return (
      <Dialog
        onTouchStart={(e) => {
          e.stopPropagation()
        }}
        PaperProps={
          isMobile()
            ? {
                style: {
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                },
              }
            : undefined
        }
        fullScreen={isMobile()}
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        style={{ backdropFilter: 'blur(10px)' }}
      >
        <div
          style={{
            position: isMobile() ? 'absolute' : undefined,
            left: isMobile() ? 0 : undefined,
            top: isMobile() ? 0 : undefined,
            right: isMobile() ? 0 : undefined,
            bottom: isMobile() ? 0 : undefined,
            direction: 'ltr',
            overflowX: 'hidden',
          }}
        >
          <div style={{ position: 'relative', overflowX: 'hidden' }}>
            <div
              class="part"
              style={{
                width: '400%',
                height: '150%',
                marginLeft: '-35%',
                marginRight: '-95%',
                marginTop: '-125%',
                transform: 'rotate(-27.5deg)',
              }}
            >
              <div class="losange" style={{ width: '100%', height: '100%' }}>
                <div class="los1" style={{ width: '100%', height: '100%' }}>
                  <img
                    src={header}
                    alt=""
                    style={{
                      width: '100%',
                      height: '100%',
                      marginLeft: '-' + window.innerWidth + 'px',
                      transform: 'rotate(+27.5deg)',
                    }}
                  />
                </div>
              </div>
            </div>

            <Card
              style={{
                borderRadius: 56,
                backgroundColor: '#666',
                padding: 4,
                width: 112,
                height: 112,
                position: 'absolute',
                marginTop: -228,
                right: 32,
              }}
            >
              <Avatar
                style={{ width: '100%', height: '100%' }}
                src={ProfileAvatar}
              />
            </Card>

            <div
              style={{
                position: 'absolute',
                width: '100%',
                right: 32,
                marginTop: -518,
              }}
            >
              <div style={{ width: '100%' }}>
                <IconButton
                  style={{
                    width: 32,
                    height: 32,
                    position: 'absolute',
                    right: -16,
                  }}
                  onClick={handleClose}
                >
                  <ArrowForwardIcon style={{ fill: '#fff' }} />
                </IconButton>
                <IconButton
                  style={{
                    width: 32,
                    height: 32,
                    position: 'absolute',
                    left: 48,
                  }}
                >
                  <SearchIcon style={{ fill: '#fff' }} />
                </IconButton>
                <IconButton
                  style={{
                    width: 32,
                    height: 32,
                    position: 'absolute',
                    left: 84,
                  }}
                >
                  <GroupAddIcon style={{ fill: '#fff' }} />
                </IconButton>
              </div>
              <div
                style={{
                  color: '#fff',
                  position: 'absolute',
                  right: 0,
                  justifyContent: 'center',
                  textAlign: 'center',
                  marginTop: 48,
                  fontWeight: 'bolder',
                  fontSize: 22,
                }}
              >
                کیهان محمدی
              </div>
            </div>
            <div
              style={{
                position: 'absolute',
                width: 'auto',
                height: 40,
                right: 32,
                marginTop: 32,
                marginTop: -432,
                display: 'flex',
                flexWrap: 'wrap',
                direction: 'rtl',
              }}
            >
              <div
                style={{
                  color: '#fff',
                  marginLeft: 12,
                  justifyContent: 'center',
                  textAlign: 'center',
                  marginTop: 12,
                  fontSize: 18,
                  background: 'rgba(0, 0, 0, 0.25)',
                  borderRadius: 20,
                  paddingLeft: 8,
                  paddingRight: 8,
                  paddingTop: 4,
                  paddingBottom: 4,
                }}
              >
                تگ تگ
              </div>
              <div
                style={{
                  color: '#fff',
                  marginLeft: 12,
                  justifyContent: 'center',
                  textAlign: 'center',
                  marginTop: 12,
                  fontSize: 18,
                  background: 'rgba(0, 0, 0, 0.25)',
                  borderRadius: 20,
                  paddingLeft: 8,
                  paddingRight: 8,
                  paddingTop: 4,
                  paddingBottom: 4,
                }}
              >
                تگ تگ تگ
              </div>
              <div
                style={{
                  color: '#fff',
                  marginLeft: 12,
                  justifyContent: 'center',
                  textAlign: 'center',
                  marginTop: 12,
                  fontSize: 18,
                  background: 'rgba(0, 0, 0, 0.25)',
                  borderRadius: 20,
                  paddingLeft: 8,
                  paddingRight: 8,
                  paddingTop: 4,
                  paddingBottom: 4,
                }}
              >
                تگ تگ
              </div>
              <div
                style={{
                  color: '#fff',
                  marginLeft: 12,
                  justifyContent: 'center',
                  textAlign: 'center',
                  marginTop: 12,
                  fontSize: 18,
                  background: 'rgba(0, 0, 0, 0.25)',
                  borderRadius: 20,
                  paddingLeft: 8,
                  paddingRight: 8,
                  paddingTop: 4,
                  paddingBottom: 4,
                }}
              >
                تگ تگ
              </div>
            </div>
          </div>
          <Fab
            color={'secondary'}
            style={{ position: 'absolute', left: 32, marginTop: -276 }}
            onClick={() => {
              let requestOptions = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  token: token,
                },
                body: JSON.stringify({
                  spaceId: null,
                  name: '',
                  participentId: props.user_id,
                }),
                redirect: 'follow',
              }
              fetch(serverRoot + '/room/create_room', requestOptions)
                .then((response) => response.json())
                .then((result) => {
                  console.log(JSON.stringify(result))
                  if (result.room !== undefined) {
                    gotoPage('/app/chat', {
                      user_id: props.user_id,
                      room_id: result.room.id,
                    })
                  }
                })
                .catch((error) => console.log('error', error))
            }}
          >
            <EditIcon />
          </Fab>
          <div
            style={{
              position: 'absolute',
              width: '100%',
              right: 200,
              marginTop: -200,
              display: 'flex',
              direction: 'rtl',
            }}
          >
            <div
              style={{
                color: '#fff',
                marginLeft: 12,
                justifyContent: 'center',
                textAlign: 'center',
                marginTop: 12,
                fontSize: 18,
                borderRadius: 20,
                padding: 8,
              }}
            >
              <div
                style={{
                  color: '#fff',
                  justifyContent: 'center',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 18,
                  marginTop: -4,
                }}
              >
                10
              </div>
              <div
                style={{
                  color: '#fff',
                  justifyContent: 'center',
                  textAlign: 'center',
                  fontWeight: 'bolder',
                  fontSize: 16,
                }}
              >
                دوستان
              </div>
            </div>
            <div
              style={{
                marginRight: 12,
                color: '#fff',
                marginLeft: 12,
                justifyContent: 'center',
                textAlign: 'center',
                marginTop: 12,
                fontSize: 18,
                borderRadius: 20,
                padding: 8,
              }}
            >
              <div
                style={{
                  color: '#fff',
                  justifyContent: 'center',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 18,
                  marginTop: -4,
                }}
              >
                25
              </div>
              <div
                style={{
                  color: '#fff',
                  justifyContent: 'center',
                  textAlign: 'center',
                  fontWeight: 'bolder',
                  fontSize: 16,
                }}
              >
                بات ها
              </div>
            </div>
          </div>
          <div
            style={{
              width: 'calc(100% - 32px)',
              height: 'auto',
              zIndex: 2,
              position: 'relative',
              paddingLeft: 24,
              direction: 'rtl',
              marginTop: -88,
              color: '#fff',
              alignText: 'right',
            }}
          >
            لورم ایپسوم یا طرح‌نما (به انگلیسی: Lorem ipsum) به متنی آزمایشی و
            بی‌معنی در صنعت چاپ، صفحه‌آرایی و طراحی گرافیک گفته می‌شود. طراح
            گرافیک از این متن به عنوان عنصری از ترکیب بندی برای پر کردن صفحه و
            ارایه اولیه شکل ظاهری و کلی طرح سفارش گرفته شده استفاده می نماید، تا
            از نظر گرافیکی نشانگر چگونگی نوع و اندازه فونت و ظاهر متن باشد.
            معمولا طراحان گرافیک برای صفحه‌آرایی، نخست از متن‌های آزمایشی و
            بی‌معنی استفاده می‌کنند تا صرفا به مشتری یا صاحب کار خود نشان دهند
            که صفحه طراحی یا صفحه بندی شده بعد از اینکه متن در آن قرار گیرد
            چگونه به نظر می‌رسد و قلم‌ها و اندازه‌بندی‌ها چگونه در نظر گرفته
            شده‌است. از آنجایی که طراحان عموما نویسنده متن نیستند و وظیفه رعایت
            حق تکثیر متون را ندارند و در همان حال کار آنها به نوعی وابسته به متن
            می‌باشد آنها با استفاده از محتویات ساختگی، صفحه گرافیکی خود را
            صفحه‌آرایی می‌کنند تا مرحله طراحی و صفحه‌بندی را به پایان برند. لورم
            ایپسوم یا طرح‌نما (به انگلیسی: Lorem ipsum) به متنی آزمایشی و
            بی‌معنی در صنعت چاپ، صفحه‌آرایی و طراحی گرافیک گفته می‌شود. طراح
            گرافیک از این متن به عنوان عنصری از ترکیب بندی برای پر کردن صفحه و
            ارایه اولیه شکل ظاهری و کلی طرح سفارش گرفته شده استفاده می نماید، تا
            از نظر گرافیکی نشانگر چگونگی نوع و اندازه فونت و ظاهر متن باشد.
            معمولا طراحان گرافیک برای صفحه‌آرایی، نخست از متن‌های آزمایشی و
            بی‌معنی استفاده می‌کنند تا صرفا به مشتری یا صاحب کار خود نشان دهند
            که صفحه طراحی یا صفحه بندی شده بعد از اینکه متن در آن قرار گیرد
            چگونه به نظر می‌رسد و قلم‌ها و اندازه‌بندی‌ها چگونه در نظر گرفته
            شده‌است. از آنجایی که طراحان عموما نویسنده متن نیستند و وظیفه رعایت
            حق تکثیر متون را ندارند و در همان حال کار آنها به نوعی وابسته به متن
            می‌باشد آنها با استفاده از محتویات ساختگی، صفحه گرافیکی خود را
            صفحه‌آرایی می‌کنند تا مرحله طراحی و صفحه‌بندی را به پایان برند.
          </div>
        </div>
      </Dialog>
    )
  }
}
