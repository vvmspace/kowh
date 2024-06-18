import { getMe } from "../../api/auth";
import { awake, getTop, useCoffee, useSandwich } from "../../api/game";
import { privateRequest, publicRequest } from "../../utils/request";
import "./style.css";
import WebApp from "@twa-dev/sdk";
import { useEffect, useState } from "preact/hooks";

export function Home() {
  const [steps, setSteps] = useState<number>(0);
  const [coffees, setCoffees] = useState<number>(0);
  const [sandwiches, setSandwiches] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [inviteMessage, setInviteMessage] = useState(
    "Invite your friends to join the King of The Hill!",
  );
  const [id, setId] = useState<string | null>(localStorage.getItem("id"));
  const [awakable, setAwakable] = useState<boolean>(false);
  const [nextAwake, setNextAwake] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [top, setTop] = useState<any[]>([]);

  const updateKing = async () => {
    const { user: king, nextAwake } = await getMe();
    setId(king.telegramId);
    setSteps(king.steps);
    setCoffees(king.coffees);
    setSandwiches(king.sandwiches);
    setNextAwake(nextAwake);
  };

  function handleInvite() {
    navigator.clipboard.writeText(
      `https://t.me/KingOfTheHillGameBot?start=${id}`,
    );
    setInviteMessage("Copied to clipboard!");
    setTimeout(
      () =>
        setInviteMessage("Invite your friends to join the King of The Hill!"),
      3000,
    );
  }

  useEffect(() => {
    (async () => {
      WebApp.ready();
      setLoading(false);
      await updateKing();
      await getTop().then((res) => setTop(res));
    })();
  }, []);

  setInterval(() => {
    const now = new Date();
    const end = new Date(nextAwake);
    const diff = end.getTime() - now.getTime();
    setAwakable(diff <= 0);
    setTimeLeft(diff);
  }, 1000);

  const WakeUpKing = async () => {
    if (!awakable) return;

    const { nextAwake } = await awake();
    setAwakable(false);
    setNextAwake(nextAwake);
    await updateKing();
  };

  return loading ? (
    <h1>loading...</h1>
  ) : (
    <div class="home">
      <h1>King of The Hill [Beta]</h1>
      <p>We are working on this game. Just enjoy!</p>
      <section>
        <a target="_blank" class="resource" onClick={WakeUpKing}>
          <h2>
            {awakable ? "Wake up the King" : "The King is climbing on the Hill"}
          </h2>
          <p>
            After every awake the King makes 10 steps and gets 1 coffee and 1
            sandwich.
          </p>
          <p>
            Steps: <b>{steps}</b>
          </p>
          <p class={"tap"}>
            {(awakable && <>Tap me</>) || <MsToTime timeLeft={timeLeft} />}
          </p>
        </a>
        {coffees > 0 && (
          <FoodCard
            icon="☕"
            title="Coffee"
            count={coffees}
            onClick={() => useCoffee().then(updateKing)}
          />
        )}
        {sandwiches > 0 && (
          <FoodCard
            icon="🥪"
            title="Sandwich"
            count={sandwiches}
            onClick={() => useSandwich().then(updateKing)}
          />
        )}
        <a class="resource" onClick={handleInvite}>
          <h2>Invite your friends</h2>
          <p>{inviteMessage}</p>
          <p>
            Get 1 sandwich every time your friend wakes up the king, as well as
            1 coffee from his friends
          </p>
        </a>
      </section>
    </div>
  );
}

function Resource(props) {
  return (
    <a
      href={props.href}
      target="_blank"
      class="resource"
      onClick={props.onClick}
    >
      <h2>{props.title}</h2>
      <p>{props.description}</p>
      <p>{props.description2}</p>
    </a>
  );
}

function FoodCard(props) {
  return (
    <div onClick={props.onClick}>
      <div>{props.icon}</div>
      <div>{props.title}</div>
      <div>{props.count}</div>
    </div>
  );
}

function MsToTime(props) {
  const { timeLeft } = props;

  const h = Math.floor(timeLeft / 1000 / 60 / 60);
  const m = Math.floor((timeLeft / 1000 / 60) % 60);
  const s = Math.floor((timeLeft / 1000) % 60);

  const hh = h < 10 ? "0" + h : h;
  const mm = m < 10 ? "0" + m : m;
  const ss = s < 10 ? "0" + s : s;

  return timeLeft > 0 ? (
    <span>
      {hh}:{mm}:{ss}
    </span>
  ) : (
    <span>00:00:00</span>
  );
}
