import * as React from 'react';

interface IProps {
  loading: boolean;
}

const withLoader = <P extends object>(
  Component: React.ComponentType<P>
): React.FunctionComponent<P & IProps> => ({ loading, ...props }: IProps) =>
  loading ? (
    <div className="ui segment">
      <p />
      <div className="ui active dimmer">
        <div className="ui loader" />
      </div>
    </div>
  ) : (
    <Component {...props as P} />
  );

export default withLoader;
