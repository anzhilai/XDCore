import React, { useState } from 'react';
import styled from '@emotion/styled';
const anchorify = (title) => title?.replace(/\s|,|\"|\'/gi, '-');

export const Heading = ({ title }) => {
  const [anchorVisible, setAnchorVisible] = useState(false);

  return (
    <Title>
      <h2
        id={anchorify(title)}
        onMouseEnter={() => setAnchorVisible(!anchorVisible)}
        onMouseLeave={() => setAnchorVisible(!anchorVisible)}>
        <Anchor show={anchorVisible} href={`#${anchorify(title)}`}>
          #
        </Anchor>{' '}
        {title}
      </h2>
    </Title>
  );
};

interface AnchorProps {
  show: boolean
}
const Anchor = styled.a<AnchorProps>`
  visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
      color: #bbb;
    font-size: 20px;
    font-weight: 300;
    position: relative;
    left: 0;
    margin: 0 0 0 -19px;
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;
