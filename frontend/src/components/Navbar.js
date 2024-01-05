import {Link} from "react-router-dom"
export default function Navbar({walletAddress, getWalletAddress}) {
    return (
      <div>

      <nav className="nav-bar">
        <Logo />
        <h1 className="title">NFT MARKET</h1>
        <div className="buttons">
        <button className="btn" onClick={getWalletAddress}>
            {walletAddress ? walletAddress.slice(0,8): "Connect Wallet"}
        </button>
        </div>
      </nav>

      <nav className="navbar">
         <span>
          <Link to="/">Home</Link>
        </span>
        <span>
          <Link to="/grounding">Grounding your nft</Link>
        </span>
        <span>
        <Link to="/create-nft">Create NFT</Link>
          </span>
      </nav>
      </div>
    );
}

function Logo() {
    return (
      <div className="logo">
        <span role="img">🪙</span>
      </div>
    );
  }
  
