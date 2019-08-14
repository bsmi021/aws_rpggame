import React from "react";
import { API } from "aws-amplify";
import { RouteComponentProps } from "react-router-dom";
import { ICharacter } from "./CharacterType";
import Character from "./Character";

type Props = RouteComponentProps<{ id: string }>;

interface CharacterPageState {
  character?: ICharacter;
}

export class CharacterPage extends React.Component<Props, CharacterPageState> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    if (this.props.match.params.id) {
      await API.get(
        "characters",
        `characters/${this.props.match.params.id}`,
        null
      )
        .then(response => {
          this.setState({ character: response });
        })
        .catch(error => alert(error));
    }
  }

  render() {
    const character = this.state.character;
    return (
      <div className="page-container">
        {character ? (
          <div className="white-box">
            <Character character={character} />
          </div>
        ) : (
          <p>Character not found!</p>
        )}
      </div>
    );
  }
}

export default CharacterPage;
