import BAlert from 'react-bootstrap/Alert';

export default function Alert(props) {

return(
  <BAlert show={props.show} key={props.variant} variant={props.variant} dismissible='true' onClose={props.setShow}>
    {props.msg}
  </BAlert>
)};