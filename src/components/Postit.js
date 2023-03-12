import styled from 'styled-components';

const ElementStyle = styled.div`
  .post-it {
    width:250px;
    height:280px;
    position:absolute;
    top: 200px;
    right: calc(50% - 400px);
    background:#ffa;
    overflow:hidden;
    margin:30px auto;
    padding:20px;
    border-radius:0 0 0 30px/45px;
    font-family: 'Permanent Marker', cursive;
    line-height:1.7em;
    font-size:19px;
    color:#130d6b;
  }

  .post-it:before {
    content:"";
    display:block;
    position:absolute;
    width:20px;
    height:25px;
    background:#ffa;
    box-shadow:
      3px -2px 10px rgba(0,0,0,0.2),
      inset 15px -15px 15px rgba(0,0,0,0.3);
    left:0;
    bottom:0;
    z-index:2;
    transform:skewX(25deg);
  }

  .post-it:after {
    content:"";
    display:block;
    position:absolute;
    width:75%;
    height:20px; 
    border-top:3px solid #130d6b;
    border-radius: 50% ;
    bottom:0px;
    left:10%;
  }

  h1 {
    font-size:25px;
  }
`;

const Postit = () => {

    return (
		<ElementStyle>
      <div className='post-it' >
        <h1>Some notes</h1>
        <ul>
            <li>Just login in with user "user1". It is only a demo... No password :-)</li>
            <li>To access as admin, use user "admin0"</li>
        </ul>    
      </div>
    </ElementStyle>
	);
};

export default Postit;
