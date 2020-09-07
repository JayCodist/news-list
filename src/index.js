import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const { useEffect, useState } = React;

const List = (props) => {
  const [items, setItems] = useState(props.items);

  useEffect(() => {
    setItems(props.items)
  }, [props.items])

  return (
    <ul>
    {
      items.map((item, i) => (
        <li key={i} onClick={() => setItems([item, ...items.filter(_item => _item !== item)])}>
          {item}
        </li>))
    }
    </ul>
  );
}

document.body.innerHTML = "<div id='root'> </div>";
  
const rootElement = document.getElementById("root");
ReactDOM.render(<List items={["A", "B", "C"]} />, rootElement);

let listItem = document.querySelectorAll("li")[1];
if(listItem) {
  listItem.click();
}
setTimeout(() => console.log(document.getElementById("root").innerHTML));