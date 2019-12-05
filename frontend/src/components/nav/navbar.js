import React from 'react';
import { Link } from 'react-router-dom'
import SearchBar from './search_bar_container';
import SubdredditIndex from '../subdreddit/subdreddit_index_container';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { userSubsDropdown: false, profileOpen: false };

    this.container = React.createRef();
    this.profileContainer = React.createRef();

    this.logoutUser = this.logoutUser.bind(this);
    this.getLinks = this.getLinks.bind(this);
    this.toggleSubsDropdown = this.toggleSubsDropdown.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleOutsideClick);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleOutsideClick);
  }

  handleOutsideClick(e) {
    if (this.container.current && !this.container.current.contains(e.target)) {
      this.setState({ userSubsDropdown: false });
    };

    if (this.profileContainer.current &&
        !this.profileContainer.current.contains(e.target)) {
          this.setState({ profileOpen: false })
        }
  }

  toggleSubsDropdown() {
    if (!this.props.userSubs.length && !this.state.userSubsDropdown) {
      this.props.fetchUserSubs(this.props.currentUserId)
        .then(res => {
          this.setState(state => {
            return { userSubsDropdown: true }
          })
        })
    }

    this.setState(state => {
      return { userSubsDropdown: !state.userSubsDropdown }
    });
  }

  toggleProfileOpen = () => {
    this.setState(state => {
      return { profileOpen: !state.profileOpen }
    })
  }

  logoutUser(e) {
    e.preventDefault();
    this.props.logout();
  }

  returnHome = () => {
    this.props.history.push('/')
  }

  // Selectively render links dependent on whether the user is logged in
  getLinks() {
    if (this.props.loggedIn) {
      return (
        <div className='nav-auth-links'>
          <div className='nav-subdreddits' ref={this.container} onClick={this.toggleSubsDropdown}>
            <div className="user-subs">
              {this.state.userSubsDropdown && (
                <SubdredditIndex subs={ this.props.userSubs } />
              )}
            </div>
          </div>
          <div className='nav-search'>
            <label>
              <div className='nav-search-logo'>
              </div>
            </label>
            <SearchBar />
          </div>
          <div className='nav-right-links'>
            <Link className='nav-post' to={'/subdreddits/new'}></Link>
            <div className='nav-profile-div' ref={this.profileContainer} onClick={this.toggleProfileOpen}>
              {this.state.profileOpen && (

              <div className='nav-profile'>
                <div className='nav-drop-down'>
                  <div className='nav-drop-profile'>
                    <label className='nav-profile-label'>
                      <div className='nav-profile-pic'>
                      </div>
                      <Link className='nav-profile-link' to={`/users/${this.props.currentUserId}`}>Profile</Link>
                    </label>
                  </div>
                  <div className='nav-drop-logout'>
                    <label className='nav-logout-label'>
                      <div className='nav-logout-pic'>
                      </div>
                      <button className='nav-logout-link' onClick={this.logoutUser}>Logout</button>
                    </label>
                  </div>
                </div>
              </div>
              )}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className='nav-links'>
          <div className='nav-signup'>
            <Link className='nav-signup-link' to={'/signup'}>Sign Up</Link>
          </div>
          <div className='nav-login'>
            <Link className='nav-login-link' to={'/login'}>Log In</Link>
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="navbar">
        <div className='nav-logo-div' onClick={ this.returnHome }>
          <div className='nav-logo'>
          </div>
          <div className='nav-site-name'>
            dreddit
          </div>
        </div>
        
        {this.getLinks()}
      </div>
    );
  }
}

export default NavBar;