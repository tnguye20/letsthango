import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import * as React from 'react';
import { useHistory } from 'react-router';
import './Join.css';
import { CustomizedAlert } from '../';
import { db } from '../../libs';
import { useAlert } from '../../hooks';
import * as ROUTES from '../../routes';
import { ALERT_TYPE, CALL_TYPE } from '../../interfaces';
import { config } from '../../shared';
import { v4 as uuidv4 } from 'uuid';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

const { useState, useRef } = React;
const { logoCount } = config;

const getLogoPath = (): string => {
  const index = Math.floor(Math.random() * (logoCount)) + 1;
  return `${process.env.PUBLIC_URL}/logo_${index}.jpg`;
}

export const Join = () => {
  const logo = useRef<string>(getLogoPath());
  const [name, setName] = useState<string>('');
  const [callID, setCallID] = useState<string>('');
  const [callType, setCallType] = useState<string>(CALL_TYPE.video);
  const { openAlert, setOpenAlert, alertMessage, alertType, fireAlert} = useAlert();
  const history = useHistory();

  const handleCreateCall = () => {
    if (name.length === 0) {
      fireAlert('Please Identify Yourself.', ALERT_TYPE.error);
      return;
    }

    // Construct location object to redirect
    const location = {
      pathname: ROUTES.ROOM,
      state: {
        name,
        callID: db.collection('calls').doc().id,
        callType,
        userID: uuidv4(),
        action: 'call'
      }
    }
    history.push(location);
  }
  const handleJoinCall = () => {
    const main = async () => {
      if (name.length === 0) {
        fireAlert('Please Identify Yourself.', ALERT_TYPE.error);
        return;
      }
      if (callID.length === 0) {
        fireAlert('Invalid Call ID. Please try again with a valid one.', ALERT_TYPE.error);
        return;
      }

      const callDoc = db.collection('calls').doc(callID);
      const testCall = await callDoc.get();
      if (!testCall.exists) {
        fireAlert('Invalid Call ID. Please try again with a valid one.', ALERT_TYPE.error);
        return;
      }
      
      // Construct location object to redirect
      const location = {
        pathname: ROUTES.ROOM,
        state: {
          name,
          callID,
          callType: testCall.data()!.callType,
          userID: uuidv4(),
          action: 'answer'
        }
      }
      history.push(location);
    }
    main();
  }

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (checked) {
      setCallType(CALL_TYPE.audio);
    }
    else {
      setCallType(CALL_TYPE.video);
    }
  }

  return (
    <>
      <div id='joinContainer'>
        <div id='inputContainer'>

          <Typography variant="h6" gutterBottom>
            <i>It takes two to </i><span id='brand'>Thango</span>
          </Typography>
          <br />

          <TextField id='name' label='Display Name' variant='standard' value={name} onChange={(e) => setName(e.target.value)}/>
          <Button id='createCallBtn' variant='contained' onClick={handleCreateCall} disabled={callID.length > 0}>Create Call</Button>

          <TextField id='callID' label='Call ID'  variant='standard' value={callID} onChange={(e) => setCallID(e.target.value)}/>
          <Button id='joinCallBtn' variant='contained' color='secondary' onClick={handleJoinCall} disabled={callID.length === 0}>Join Call</Button>

          <div>
            <FormGroup row>
              <FormControlLabel
                control={<Checkbox onChange={handleCheck} name="callTypeCheck" disabled={callID.length > 0}/>}
                label="Audio Call Only"
              />
            </FormGroup>
          </div>
          <br />
          <a target='_blank' href={ROUTES.PATREON}>Support The Project!</a>
        </div>
        <div id='logoContainer'>
          <img src={logo.current} alt='logo'/>
        </div>
      </div>

      <CustomizedAlert duration={5000} openAlert={openAlert} setOpenAlert={setOpenAlert} alertMessage={alertMessage} alertType={alertType}/>
    </>
  )
}