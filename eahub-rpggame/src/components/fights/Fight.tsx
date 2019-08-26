import * as React from 'react';
import { IApplicationState } from '../../store/Store';
import { IFight, IAttack, IFightState } from '../../types/FightTypes';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  List,
  Transition,
  Segment,
  Progress,
  Loader,
  Modal,
  Button
} from 'semantic-ui-react';
import { attack, getFight, claimLoot } from '../../actions/FightActions';
import { getAttackText } from './fightUtils';
import { FightEnemyNameplate } from './FightEnemyNameplate';
import { getItem } from '../../actions/ItemActions';
import ItemCard from '../items/ItemCard';

interface IProps {
  fight?: IFight;
}

export const Fight: React.FunctionComponent<IProps> = (props: IProps) => {
  const dispatch = useDispatch();

  // grab the information for the enemy to display on the screen
  const currentEnemy = useSelector((state: IApplicationState) => {
    return state.fights.currentFightEnemy;
  });

  const [lootLoaded, setLootLoaded] = React.useState(false);

  const [lootClaimed, setLootClaimed] = React.useState(false);

  // if an attack has been cast we need to put the attack button on CD
  const [attackActive, setAttackActive] = React.useState(true);

  // there needs to be a selected character to do anything
  const currentCharacter = useSelector((store: IApplicationState) => {
    return store.characters.defaultCharacter;
  });

  // set the lootItem state to the application store
  const lootItem = useSelector((state: IApplicationState) => {
    return state.items.currentItem;
  });

  // get the collection of attacks for the fight
  const attacks = useSelector(
    (store: IApplicationState) => store.fights.attacks
  );

  // determine if the item is loading
  const lootLoading = useSelector((state: IApplicationState) => {
    return state.items.itemsLoading;
  });

  React.useEffect(() => {
    // check if the fight is over (ensure other values set)
    // go get the item data for the loot

    if (
      props.fight &&
      currentCharacter &&
      !props.fight.is_active &&
      !lootLoaded &&
      props.fight.characters.filter(
        x => x.id === currentCharacter.id && x.loot_item_id && !x.loot_claimed
      ).length !== 0
    ) {
      dispatch(
        getItem(
          props.fight.characters.filter(x => x.id === currentCharacter.id)[0]
            .loot_item_id
        )
      );
      setLootLoaded(true);
    }
  });

  const fight = props.fight;

  // if there is no fight get out of here
  if (!fight) {
    return null;
  }
  // if there is no current character get out of here
  if (!currentCharacter) {
    return null;
  }

  const onAttackClick = (e: any) => {
    e.preventDefault();

    // only cast the attack if the currentCharacter is set
    if (currentCharacter) {
      dispatch(attack(currentCharacter.id, fight.id));
      setAttackActive(false);

      setTimeout(() => setAttackActive(true), currentCharacter.attack_speed);
    }
  };

  return (
    <div className="ui container">
      <Grid container={true} stackable={true} celled={true}>
        <Grid.Row>
          <Grid.Column>
            <Grid>
              <Grid.Row stretched={true}>
                <Grid.Column width={8}>
                  <Segment>
                    <div>
                      {currentCharacter.name} | {currentCharacter.level}
                    </div>
                    <Progress
                      total={currentCharacter.hit_points}
                      value={
                        fight.characters.filter(
                          x => x.id === currentCharacter.id
                        )[0].curr_hp
                      }
                      color="green"
                    />
                  </Segment>
                </Grid.Column>
                <Grid.Column width={8}>
                  {currentEnemy && (
                    <FightEnemyNameplate enemy={currentEnemy} fight={fight} />
                  )}
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Segment>
              {!fight.is_active && (
                <Modal
                  size="mini"
                  trigger={
                    <Button
                      icon={true}
                      color="yellow"
                      onClick={e => {
                        dispatch(getFight(fight.id));
                      }}
                    >
                      <i className="icon trophy centered" />
                    </Button>
                  }
                  stye={{ width: '25em' }}
                >
                  <Modal.Header>You've got loot</Modal.Header>
                  <Modal.Content>
                    {currentCharacter &&
                      fight.characters.filter(
                        i => i.id === currentCharacter.id
                      )[0] && (
                        <div>
                          <Loader active={!lootLoading}>
                            Getting your loot
                          </Loader>
                          {lootItem && !lootClaimed && (
                            <ItemCard item={lootItem} />
                          )}
                        </div>
                      )}
                  </Modal.Content>
                  <Modal.Actions>
                    {!fight.characters.filter(
                      i => i.id === currentCharacter.id
                    )[0].loot_claimed && (
                      <span>
                        <button className="ui button red">Leave it</button>
                        <button
                          className="ui button green"
                          onClick={e => {
                            dispatch(claimLoot(fight.id));
                            setLootClaimed(true);
                          }}
                        >
                          Take your loot
                        </button>
                      </span>
                    )}
                  </Modal.Actions>
                </Modal>
              )}
            </Segment>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns="equal" stretched={true}>
          <Grid.Column width={16}>
            <button
              className="ui button primary"
              disabled={!attackActive || !fight.is_active}
              onClick={onAttackClick}
            >
              <div>
                <Loader active={!attackActive} size="mini" />
                Attack!
              </div>
            </button>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row stretched={true}>
          <Grid.Column width={16}>
            <Segment className="ui centered container ">
              <div
                style={{ maxHeight: '25em', height: '25em', overflow: 'auto' }}
              >
                <Transition.Group
                  as={List}
                  duration={500}
                  divided={true}
                  relaxed={true}
                  animation="slide left"
                >
                  {attacks
                    .filter((a: IAttack) => a.fight_id === fight.id)
                    .sort((a: IAttack, b: IAttack) =>
                      a.attack_ts > b.attack_ts ? -1 : 1
                    )
                    .map(att => {
                      return (
                        <List.Item key={att.id} style={{ width: '100%' }}>
                          <List.Description>
                            {currentEnemy && getAttackText(att, currentEnemy)}
                          </List.Description>
                        </List.Item>
                      );
                    })}
                </Transition.Group>
              </div>
            </Segment>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row />
      </Grid>
    </div>
  );
};

export default Fight;
