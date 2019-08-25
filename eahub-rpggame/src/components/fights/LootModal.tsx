import * as React from 'react';
import { Modal, Loader } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { IItemsState } from '../../types/ItemTypes';

interface IProps {
  charId: string;
  item_id: string;
  fight_id: string;
  trigger: any;
}

export const LootModal: React.FunctionComponent<IProps> = (props: IProps) => {
  const item = useSelector((state: IItemsState) => {
    return state.currentItem;
  });
  const itemLoading = useSelector((state: IItemsState) => {
    return state.itemsLoading;
  });

  return (
    <Modal trigger={props.trigger}>
      <Modal.Header>You've got loot!</Modal.Header>
      <Modal.Description>
        <Loader active={!itemLoading} />
      </Modal.Description>
    </Modal>
  );
};

export default LootModal;
