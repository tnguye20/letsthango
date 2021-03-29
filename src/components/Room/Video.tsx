import * as React from 'react';
import Slider from '@material-ui/core/Slider';
import { Peer } from '../../interfaces';
import Grid from '@material-ui/core/Grid';
import VolumeDown from '@material-ui/icons/VolumeDown';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Tooltip from '@material-ui/core/Tooltip';
const { useRef, useEffect, useState, memo } = React;

const useStyles = makeStyles({
  slider: {
    width: 100,
  },
});

interface VideoProp {
  peer: Peer
}

// const areEqual = (prevPeer: Readonly<VideoProp>, currentPeer: Readonly<VideoProp>) => {
//   return prevPeer.peer.peerID === currentPeer.peer.peerID;
// }

export const Video = memo(({
  peer
}: VideoProp) => {
  const classes = useStyles();
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoID = `#video_${peer.peerID.split('-')[0]}`;
  const [value, setValue] = useState<number>(process.env.NODE_ENV === 'development' ? 0 : 0.2);

  const handleChange = (event: any, newValue: number | number[]) => {
    setValue(newValue as number);
    if (videoRef.current) {
      videoRef.current.volume = newValue as number;
    }
  };

  useEffect(() => {
    videoRef.current!.srcObject = peer.remoteStream;
    videoRef.current!.volume = process.env.NODE_ENV === 'development' ? 0 : 0.2;
  }, [peer.remoteStream])

  return (
    <div className={`videos ${videoID.slice(1,)}`}>
      <span>
        <video id={videoID} ref={videoRef} autoPlay playsInline></video>
      </span>
      <div className='name'>
        <div>
          {peer.name}
        </div>
      </div>
      <Grid className='action' container spacing={2} justify='center' alignContent='center' alignItems='center'>
        <Tooltip title='Volume' placement='top'>
          <VolumeDown />
        </Tooltip>
        <Grid item className={classes.slider}>
          <Slider value={value} onChange={handleChange} aria-labelledby="continuous-slider" min={0} max={1} step={0.1} />
        </Grid>
      </Grid>
    </div>
  )
});