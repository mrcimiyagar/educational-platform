import React, {useEffect} from 'react';
import HomeToolbar from '../../components/HomeToolbar';
import BotsBoxSearchbar from '../../components/BotsBoxSearchbar';
import Draggable from 'react-draggable'

var lastScrollTop = 0;

export default function BotsBox(props) {
    useEffect(() => {
        let element = document.getElementById('botsContainer')
        let botsSearchbar = document.getElementById('botsSearchbar')
        element.addEventListener("scroll", function() {
            var st = element.scrollTop;
            if (st > lastScrollTop){
                botsSearchbar.style.transform = 'translateY(-100px)'
                botsSearchbar.style.transition = 'transform .5s'
            } else {
                botsSearchbar.style.transform = 'translateY(0)'
                botsSearchbar.style.transition = 'transform .5s'
            }
            lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
        }, false);
    }, [])
    return (
        <div style={{width: "100%", height: '100%'}}>
            <img style={{width: '100%', height: '100%', position: 'fixed', left: 0, top: 0, zIndex: 1}} src={'https://4kwallpapers.com/images/wallpapers/colorful-background-texture-multi-color-orange-illustration-1080x1920-3104.jpg'}/>
            <HomeToolbar>
                <div id={'botsSearchbar'} style={{width: '75%', position: 'absolute', right: '12.5%', top: 32, zIndex: 3}}>
                    <BotsBoxSearchbar openMenu={props.openMenu}/>
                </div>
            </HomeToolbar>
            <div id={'botsContainer'} style={{width: '100%', height: '100%', overflow: 'auto', zIndex: 2, position: 'absolute', left: 0, top: 0}}>
                <div style={{width: '100%', height: 2000}}>
                    {[0, 0, 0, 0, 0, 0, 0, 0, 0].map((item, index) => (
                        <Draggable>
                            <div style={{backgroundColor: '#fff', width: 150, height: 150, position: 'absolute', left: 150, top: index * 200 + 150}}>
                                I can now be moved around!
                            </div>
                        </Draggable>
                    ))}
                </div>
            </div>
        </div>
    );
}
