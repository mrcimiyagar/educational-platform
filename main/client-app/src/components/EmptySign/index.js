
import React from 'react'
import { isDesktop } from '../../App'
import EmptyIcon from '../../images/empty.png'

export default function EmptySign(props) {
    return (
        <div style={{width: 250, height: 250, position: isDesktop ? undefined : 'absolute', top: isDesktop ? undefined : 80, left: isDesktop ? undefined : 'calc(50% - 125px)', right: isDesktop ? undefined : 'calc(50% - 125px)', marginRight: isDesktop ? 'calc(50% - 125px)' : undefined, marginLeft: isDesktop ? 'calc(50% - 125px)' : undefined, marginTop: isDesktop ? 80 : undefined, backgroundColor: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)', borderRadius: '50%'}}>
          <img src={EmptyIcon} style={{width: '100%', height: '100%', padding: 64}}/>
        </div>
    )
}