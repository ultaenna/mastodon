import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ImmutablePropTypes from 'react-immutable-proptypes';
import LoadingIndicator from '../../components/loading_indicator';
import {
  fetchAccount,
  fetchFollowers,
  expandFollowers
} from '../../actions/accounts';
import { ScrollContainer } from 'react-router-scroll';
import AccountContainer from '../../containers/account_container';
import Column from '../ui/components/column';
import HeaderContainer from '../account_timeline/containers/header_container';
import LoadMore from '../../components/load_more';
import ColumnBackButton from '../../components/column_back_button';

const mapStateToProps = (state, props) => ({
  accountIds: state.getIn(['user_lists', 'followers', Number(props.params.accountId), 'items'])
});

const Followers = React.createClass({

  propTypes: {
    params: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    accountIds: ImmutablePropTypes.list
  },

  mixins: [PureRenderMixin],

  componentWillMount () {
    this.props.dispatch(fetchAccount(Number(this.props.params.accountId)));
    this.props.dispatch(fetchFollowers(Number(this.props.params.accountId)));
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.accountId !== this.props.params.accountId && nextProps.params.accountId) {
      this.props.dispatch(fetchAccount(Number(nextProps.params.accountId)));
      this.props.dispatch(fetchFollowers(Number(nextProps.params.accountId)));
    }
  },

  handleScroll (e) {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (scrollTop === scrollHeight - clientHeight) {
      this.props.dispatch(expandFollowers(Number(this.props.params.accountId)));
    }
  },

  handleLoadMore (e) {
    e.preventDefault();
    this.props.dispatch(expandFollowers(Number(this.props.params.accountId)));
  },

  render () {
    const { accountIds } = this.props;

    if (!accountIds) {
      return (
        <Column>
          <LoadingIndicator />
        </Column>
      );
    }

    return (
      <Column>
        <ColumnBackButton />

        <ScrollContainer scrollKey='followers'>
          <div className='scrollable' onScroll={this.handleScroll}>
            <div>
              <HeaderContainer accountId={this.props.params.accountId} />
              {accountIds.map(id => <AccountContainer key={id} id={id} withNote={false} />)}
              <LoadMore onClick={this.handleLoadMore} />
            </div>
          </div>
        </ScrollContainer>
      </Column>
    );
  }

});

export default connect(mapStateToProps)(Followers);
