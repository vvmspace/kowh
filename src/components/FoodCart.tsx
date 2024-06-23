export function FoodCard(props) {
    return (
      <div class="food" onClick={props.onClick}>
        <div class="icon">{props.icon}</div>
        <div class="name">{props.title}</div>
        <div class="count">{props.count}</div>
        {props.steps && (<div class="steps">+{props.steps}</div>)}
      </div>
    );
  };