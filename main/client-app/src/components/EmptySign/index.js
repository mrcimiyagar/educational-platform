
import React from 'react'
import { isDesktop } from '../../App'
import EmptyIcon from '../../images/empty.png'

export default function EmptySign(props) {
    return (
        <div style={{width: 250, height: 250, position: isDesktop === 'desktop' ? undefined : 'absolute', top: isDesktop === 'desktop' ? undefined : 80, left: isDesktop === 'desktop' ? undefined : 'calc(50% - 125px)', right: isDesktop === 'desktop' ? undefined : 'calc(50% - 125px)', marginRight: isDesktop === 'desktop' ? 'calc(50% - 125px)' : undefined, marginLeft: isDesktop === 'desktop' ? 'calc(50% - 125px)' : undefined, marginTop: isDesktop === 'desktop' ? 80 : undefined, backgroundColor: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)', borderRadius: '50%'}}>
          <img src={EmptyIcon} style={{width: '100%', height: '100%', padding: 64}}/>
        </div>
    )
}