import { Icon } from "./Icon"

interface NavigationProps {
  onChatOpen: () => void
}

export function Navigation({ onChatOpen }: NavigationProps) {
  return (
    <header className="topbar">
      <button className="icon-button mobile-only" aria-label="Open menu">
        <Icon name="menu" />
      </button>
      <a className="brand" href="#" aria-label="Aroha home">
        <span className="brand-mark">
          <Icon name="heart" size={19} />
        </span>
        <span>Aroha</span>
      </a>
      <nav className="main-nav" aria-label="Primary navigation">
        <a className="active" href="#">
          <Icon name="home" size={17} /> Home
        </a>
        <a href="#assessment">
          <Icon name="sparkle" size={17} /> Health guide
        </a>
        <a href="#experts">
          <Icon name="user" size={17} /> Find experts
        </a>
        <a href="#wellness">
          <Icon name="leaf" size={17} /> Wellness
        </a>
        <button onClick={onChatOpen}>
          <Icon name="message" size={17} /> AI assistant
        </button>
      </nav>
      <div className="top-actions">
        <button className="help-button" onClick={onChatOpen}>
          <Icon name="message" size={17} /> Ask AI
        </button>
        <button className="avatar" aria-label="Open profile">
          AK
        </button>
      </div>
    </header>
  )
}
