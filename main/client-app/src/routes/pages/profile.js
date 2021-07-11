
import { Avatar, Card, Fab } from "@material-ui/core";
import React from "react";
import header from '../../images/profile-header.jpeg'
import EditIcon from '@material-ui/icons/Edit';

export default function Profile(props) {
return (
<div style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, backgroundColor: '#fff', direction: 'ltr'}}>
  <div style={{position: 'relative'}}>
    <img src={header} alt="" style={{height: 376, width: '100%'}}/>
    <div style={{position: 'absolute', left: -32, right: -32, width: 'calc(100% + 64px)', height: 168, transform: 'rotate(-12.5deg)', backgroundColor: '#fff', marginTop: -112}}></div>
    <Card style={{borderRadius: 56, width: 112, height: 112, position: 'absolute', marginTop: -144, left: 32}}>
      <Avatar style={{width: '100%', height: '100%'}} src={'https://www.nj.com/resizer/h8MrN0-Nw5dB5FOmMVGMmfVKFJo=/450x0/smart/cloudfront-us-east-1.images.arcpublishing.com/advancelocal/SJGKVE5UNVESVCW7BBOHKQCZVE.jpg'}/>
    </Card>
  </div>
  <Fab color={'secondary'} style={{position: 'absolute', right: 32, marginTop: -176}}>
    <EditIcon/>
  </Fab>
</div>
)
}