const jsonResult = {
  type: 'root',
  children: [
    {
      key: 'common',
      type: 'nested',
      children: [
        { key: 'follow', type: 'added', value: false },
        { key: 'setting1', type: 'unchanged', value: 'Value 1' },
        { key: 'setting2', type: 'deleted', value: 200 },
        { key: 'setting3', type: 'changed', value1: true, value2: null },
        { key: 'setting4', type: 'added', value: 'blah blah' },
        { key: 'setting5', type: 'added', value: { key5: 'value5' } },
        {
          key: 'setting6',
          type: 'nested',
          children: [
            {
              key: 'doge',
              type: 'nested',
              children: [{ key: 'wow', type: 'changed', value1: '', value2: 'so much' }],
            },
            { key: 'key', type: 'unchanged', value: 'value' },
            { key: 'ops', type: 'added', value: 'vops' },
          ],
        },
      ],
    },
    {
      key: 'group1',
      type: 'nested',
      children: [
        { key: 'baz', type: 'changed', value1: 'bas', value2: 'bars' },
        { key: 'foo', type: 'unchanged', value: 'bar' },
        { key: 'nest', type: 'changed', value1: { key: 'value' }, value2: 'str' },
      ],
    },
    {
      key: 'group2',
      type: 'deleted',
      value: { abc: 12345, deep: { id: 45 } },
    },
    {
      key: 'group3',
      type: 'added',
      value: {
        deep: { id: { number: 45 } },
        fee: 100500,
      },
    },
  ],
};

export default jsonResult;