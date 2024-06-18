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
  const [inviteMessage, setInviteMessage] = useState("");
  const [id, setId] = useState<string | null>(localStorage.getItem("id"));
  const [awakable, setAwakable] = useState<boolean>(false);
  const [nextAwake, setNextAwake] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(3600000);
  const [top, setTop] = useState<any[]>([]);
  const isLocal = location.hostname === "localhost";
  const [king, setKing] = useState<any>({});
  const [easterTaps, setEasterTaps] = useState(7);

  const updateKing = async () => {
    const { user: king, nextAwake } = await getMe();
    setKing(king);
    setInviteMessage(`https://t.me/KingOfTheHillGameBot?start=${king.telegramId}`)
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
    setInviteMessage(`https://t.me/KingOfTheHillGameBot?start=${id} (Copied)`);
    setTimeout(
      () =>
        setInviteMessage(`https://t.me/KingOfTheHillGameBot?start=${id}`),
      3000,
    );
  }

  useEffect(() => {
    (async () => {
      WebApp.ready();
      setLoading(false);
      await getTop().then((res) => {
        console.log(res);
        return setTop(res);
      });
      await updateKing();
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

    setAwakable(false);
    setTimeLeft(3600000);
    const { nextAwake } = await awake();
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
            {awakable ? "Wake up the King" : "The King is climbing"}
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
        <div class="cards">
        {(sandwiches > 0 || isLocal) && (
          <FoodCard
            icon="🥪"
            title="Sandwich"
            count={sandwiches}
            steps={3}
            onClick={() => useSandwich().then(updateKing)}
          />
        )}
        {(coffees > 0 || isLocal) && (
          <FoodCard
            icon="☕"
            title="Coffee"
            count={coffees}
            steps={1}
            onClick={() => useCoffee().then(updateKing)}
          />
        )}
        </div>
        <a class="resource" onClick={handleInvite}>
          <h2>Invite your friends</h2>
          <p>
            1 🥪 when your friend wakes up the King<br />
            1 ☕ when his friend wakes up the King
          </p>
          <p>{inviteMessage}</p>
        </a>
        {easterTaps <= 0 && (<div class="resource">
          <p>{JSON.stringify(king)}</p>
        </div>)}
        <div class="resource" onClick={() => setEasterTaps(easterTaps - 1)}>
          <h2>Top 10</h2>
          {top.map((user, i) => (
            <p>
              {i + 1}. {user.languageCode && `[${user.languageCode}]` || ''} {user.telegramUsername || user.telegramId} - {user.steps} steps, {user.coffees} coffees, {user.sandwiches} sandwiches
            </p>
          ))}
        </div>
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
    <div class="food" onClick={props.onClick}>
      <div class="icon">{props.icon}</div>
      <div class="name">{props.title}</div>
      <div class="count">{props.count}</div>
      <div class="steps">+{props.steps}</div>
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
