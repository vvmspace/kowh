export function MsToTime(props) {
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