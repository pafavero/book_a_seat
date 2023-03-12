import BModal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function Modal(props) {
  const txt = `Do you really want delete the selected row?`
  return(
    <BModal show={props.idToDel?true:false}
      size= 'sm' centered='true'
      // onHide={setMsg}
      backdrop="static">
      <BModal.Body>{txt}</BModal.Body>
      <BModal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={props.handleDel}>
          Delete
        </Button>
      </BModal.Footer>
    </BModal>
  )
};