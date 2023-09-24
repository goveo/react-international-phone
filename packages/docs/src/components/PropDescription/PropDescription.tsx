import React from 'react';

interface PropDescriptionProps {
  type: React.ReactNode;
  description: React.ReactNode;
  defaultValue: React.ReactNode;
}

export const PropDescription: React.FC<PropDescriptionProps> = ({
  type,
  description,
  defaultValue,
}) => {
  return (
    <div>
      <p style={{ marginBottom: '0.25rem' }}>{description}</p>
      <ul>
        <li>
          Type: <code>{type}</code>
        </li>
        {defaultValue && (
          <li>
            Default: <code>{defaultValue}</code>
          </li>
        )}
      </ul>
    </div>
  );
};
