import styled from 'styled-components';

const ElementStyle = styled.div`
  {
    visibility: hidden;
    opacity: 0;
    transition: all 0.3s ease-in-out;
    transform: scale(1.3);
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(21, 17, 17, 0.61);
    display: flex;
    align-items: center;
  }

  &:target{
    visibility: visible;
    opacity: 1;
    transform: scale(1);
  }

  h3{
    margin:10px;
  }

  .popup-content {
    background-color: #fefefe;
    margin: auto;
    padding: 1px 5px;
    border: 1px solid #888;
    width: 25%;

    p{
      font-size: 17px;
      padding: 10px;
      line-height: 20px;
    }

    a.close{
      color: #aaaaaa;
      float: right;
      font-size: 28px;
      font-weight: bold;
      background: none;
      padding: 0;
      margin: 0;
      text-decoration:none;
    }

    a.close:hover{
      color:#333;
    }

    span:hover,
    span:focus {
      color: #000;
      text-decoration: none;
      cursor: pointer;
    }
  }

  &.is_shown  {
    visibility: visible;
    opacity: 1;
  }
`;

function Popup() {
  return (
    <ElementStyle id="popup1" className="popup-container">
      <div className="popup-content">
        <a href="#" className="close">&times;</a>
        <h3>Popup 1</h3>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text 
          ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
      </div>
    </ElementStyle>
  )
}

export default Popup;
  