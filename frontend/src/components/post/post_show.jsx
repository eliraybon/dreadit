import React from 'react';
import CommentForm from '../comment/create_comment_form_container';
import CommentIndex from '../comment/comment_index_container';

export default class PostShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      votes: 0,
      upvoted: false,
      downvoted: false,
      isCounted: false 
    }

    this.countVotes = this.countVotes.bind(this);
    this.upvote = this.upvote.bind(this);
    this.downvote = this.downvote.bind(this);
    this.removeVote = this.removeVote.bind(this);
  }

  componentDidMount() {
    this.props.fetchPost(this.props.match.params.postId)
      .then(() => this.countVotes())
  }

  componentDidUpdate(prevProps) {
    if (this.props.postId !== prevProps.postId) {
      this.props.fetchPost(this.props.postId)
        .then(() => this.countVotes())
    }
  }

  countVotes() {
    if (this.state.isCounted) return;

    let count = 0;
    let upvoted = false;
    let downvoted = false;

    this.props.fetchPostVotes(this.props.postId)
      .then(res => {
        const votes = Object.values(res.data);
        votes.forEach(vote => {
          (vote.upvote) ? count += 1 : count -= 1;

          if (vote.user === this.props.currentUserId) {
            if (vote.upvote) upvoted = true;
            if (!vote.upvote) downvoted = true;
          }

        });

        if (this.state.votes !== count) {
          this.setState({ votes: count, upvoted, downvoted })
        }
      })
  }

  upvote() {
    const postId = this.props.postId;
    const userId = this.props.currentUserId;
    const upvote = true;

    if (this.state.upvoted || this.state.downvoted) {
      this.props.updateVote({ postId, userId, upvote })
        .then(() => {
          this.setState({ upvoted: upvote, downvoted: !upvote, isCounted: false });
          this.countVotes();
        })
    } else {
      this.props.voteOnPost({ postId, userId, upvote })
        .then(() => {
          this.setState({ upvoted: upvote, downvoted: !upvote, isCounted: false });
          this.countVotes();
        })
    }
  }

  downvote() {
    const postId = this.props.post._id;
    const userId = this.props.currentUserId;
    const upvote = false;

    if (this.state.upvoted || this.state.downvoted) {
      this.props.updateVote({ postId, userId, upvote })
        .then(() => {
          this.setState({ upvoted: upvote, downvoted: !upvote, isCounted: false });
          this.countVotes();
        })
    } else {
      this.props.voteOnPost({ postId, userId, upvote })
        .then(() => {
          this.setState({ upvoted: upvote, downvoted: !upvote, isCounted: false });
          this.countVotes();
        })
    }
  }

  removeVote() {
    const userId = this.props.currentUserId;
    const postId = this.props.post._id;

    this.props.removeVote({ userId, postId })
      .then(() => {
        this.countVotes();
      })
  }


  render() {
    const { post } = this.props;
    if (!post) return null;

    return (
      <div className="post-show">
        <button onClick={this.upvote}>Upvote</button>
        <button onClick={this.downvote}>Downvote</button>
        {this.state.votes}
        <h1>{post.title}</h1>
        <p>{post.text}</p>

        <CommentForm postId={ post._id } />
        <CommentIndex comments={ this.props.comments } context="post" />
      </div>
    )
  }
}