import React, { DOMAttributes } from 'react';
import { UIElementProps } from '@libs/ui';
import styled from 'styled-components';
import { useDeploymentTarget } from '@anchor-protocol/app-provider';
import AdjustIcon from '@mui/icons-material/Adjust';
import { Terra } from '@anchor-protocol/icons';

interface ChainButtonProps
  extends UIElementProps,
  Pick<DOMAttributes<HTMLButtonElement>, 'onClick'> { }

const ChainButtonBase = (props: ChainButtonProps) => {
  const { className, onClick } = props;
  const {
    target: { chain },
  } = useDeploymentTarget();
  return (
    <button className={className} onClick={onClick}>
      <div className="button-nowrap">
        <Terra fontSize="small" color="primary" /> <div className="chain-name">{chain}</div>
      </div>
    </button>
  );
};

export const ChainButton = styled(ChainButtonBase)`
  border-radius: 20px;
  padding: 4px 17px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.header.textColor};
  border: 1px solid ${({ theme }) => theme.header.textColor};
  outline: none;
  background-color: transparent;
  .button-nowrap {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    flex-wrap: nowrap;
  }
  .button-logo {
    height: 14px;
    padding-left: 5px;
  }
`;
