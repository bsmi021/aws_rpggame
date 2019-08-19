import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  getCharacter,
  setDefaultCharacter
} from '../../actions/CharacterActions';
import { ICharacter } from '../../types/CharacterTypes';
import { IApplicationState } from '../../store/Store';
import Character from './Character';

interface IProps extends RouteComponentProps<{ id: string }> {
  getCharacter: typeof getCharacter;
  setDefaultCharacter: typeof setDefaultCharacter;
  loading: boolean;
  character?: ICharacter;
}

class CharacterPage extends React.Component<IProps> {
  public async componentDidMount() {
    this.props.getCharacter(this.props.match.params.id);
  }

  public render() {
    const character = this.props.character;

    return (
      <div className="ui container">
        {character ? (
          <Character
            character={character}
            loading={this.props.loading}
            setDefaultCharacter={this.props.setDefaultCharacter}
          />
        ) : (
          <></>
        )}
      </div>
    );
  }
}

const mapStateToProps = (store: IApplicationState) => {
  return {
    loading: store.characters.charactersLoading,
    character: store.characters.currentCharacter || undefined
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    getCharacter: (id: string) => dispatch(getCharacter(id)),
    setDefaultCharacter: (char: ICharacter) =>
      dispatch(setDefaultCharacter(char))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CharacterPage);
