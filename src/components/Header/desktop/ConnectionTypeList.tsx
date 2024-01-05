import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { ButtonList } from '../shared';

interface ConnectionTypeListProps {
  className?: string;
  header?: {
    node: ReactNode;
    title: string;
  }
  footer?: ReactNode;
  children: ReactNode;
}

function ConnectionTypeListBase({
  className,
  header,
  footer,
  children,
}: ConnectionTypeListProps) {
  return (
    <>
      {
        header && <TopButtonList className={className} title={header.title} >
          {header.node}
        </TopButtonList>
      }

      <ButtonList className={className} title="Already have a wallet ?" footer={footer}>
        {children}
      </ButtonList>
    </>
  );
}

const TopButtonList = styled(ButtonList)`
  padding-bottom: 0px !important;
`

export const ConnectionTypeList = styled(ConnectionTypeListBase)`
  .connect {
    background-color: ${({ theme }) =>
    theme.palette_type === 'light' ? '#f4f4f5' : '#2a2a46'};
    color: ${({ theme }) => theme.textColor};
  }

  .install {
    border: 1px solid
      ${({ theme }) =>
    theme.palette_type === 'light' ? '#e7e7e7' : 'rgba(231,231,231, 0.3)'};
    color: ${({ theme }) => theme.textColor};
  }

  .readonly {
    border: 1px solid ${({ theme }) => theme.dimTextColor};
    color: ${({ theme }) => theme.dimTextColor};
  }
`;
