import AddIcon from "@material-ui/icons/Add";
import CloseIcon from '@material-ui/icons/Close';
import "chartjs-plugin-datalabels";
import React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-circular-progressbar/dist/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import "react-table/react-table.css";
import {
    Button, Modal,
    ModalBody,
    ModalHeader
} from "reactstrap";
import FilesGrid from "../../components/FilesGrid/FilesGrid";
import { colors, token } from "../../util/settings";
import { useForceUpdate } from "../../util/Utils";


export let toggleFileBox = undefined;

export let FileBox = (props) => {
  let forceUpdate = useForceUpdate()
  const [files, setFiles] = React.useState([]);
  let uploadBtn = React.useRef();
  let [filesBoxOpen, setFilesBoxOpen] = React.useState(false);
  const [openFileSelector, { filesContent, loading, errors }] = useFilePicker({
    readAs: 'DataURL'
  });
  let fetchFiles = () => {
    let requestOptions = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'token': token
      },
      body: JSON.stringify({
          roomId: props.roomId
      }),
      redirect: 'follow'
    };
    fetch("../file/get_files", requestOptions)
          .then(response => response.json())
          .then(result => {
              console.log(JSON.stringify(result));
              result.files.forEach(fi => {
                  fi.progress = 100;
              });
              setFiles(result.files);
          })
          .catch(error => console.log('error', error));
  }
  toggleFileBox = () => {
    if (!filesBoxOpen) {
      fetchFiles()
    }
    setFilesBoxOpen(!filesBoxOpen);
  }
  function onChangeFile(event) {
    event.stopPropagation();
    event.preventDefault();
    let file = event.target.files[0];
    let data = new FormData();
    data.append('file', file);
    let request = new XMLHttpRequest();
    request.open('POST', `../file/upload_file?token=${token}&roomId=${props.roomId}`);
    request.upload.addEventListener('progress', function(e) {
        let percent_completed = (e.loaded * 100 / e.total);
    });
    let f = {progress: 0, name: file.name, size: file.size, local: true};
    files.push(f)
    setFiles(files)
    forceUpdate()
    if (FileReader && files && files.length) {
        let fr = new FileReader();
        fr.onload = function () {
            f.src = fr.result;
        }
        fr.readAsDataURL(file);
    }
    request.send(data);
  }
  return (
    <Modal
        isOpen={filesBoxOpen}
        toggle={toggleFileBox}
        wrapClassName="modal-right"
        backdrop={true}
        >
          <div
        style={{backgroundColor: colors.primaryLight, width: '100%', height: '100%', minHeight: '100vh'}}>
          <ModalHeader toggle={toggleFileBox} close={<Button style={{border: 'none', background: 'transparent'}} onClick={toggleFileBox}><CloseIcon style={{fill: colors.textIcons}}/></Button>}>
            <span><p style={{color: colors.textIcons}}>فایل ها</p></span>
            <Button outline color="primary" className="mb-2" style={{color: colors.textIcons, border: '1px solid ' + colors.textIcons, paddingTop: 0, paddingBottom: 0, paddingLeft: 4, paddingRight: 4, 
              textAlign: 'center', width: 40, fontSize: 12, height: 32, marginRight: 16}} onClick={() => openFileSelector()}>
              <AddIcon/>
            </Button>
          </ModalHeader>
          <ModalBody style={{height: '100%', overflowY: 'auto'}}>
            <input id="myInput"
               type="file"
               ref={(ref) => uploadBtn = ref}
               style={{display: 'none'}}
               onChange={onChangeFile}/>
            <PerfectScrollbar>
              <FilesGrid files={files} setFiles={setFiles} roomId={props.roomId}/>
            </PerfectScrollbar>
          </ModalBody>
          </div>
    </Modal>);
}