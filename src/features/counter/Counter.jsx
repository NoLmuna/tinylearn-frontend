import { useState } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';

/**
 * Counter Feature Component
 * Example feature component demonstrating state management
 */
function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  return (
    <Card title="Counter Example">
      <div className="text-center">
        <div className="text-6xl font-bold text-indigo-600 mb-8">
          {count}
        </div>
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={decrement}>
            Decrease
          </Button>
          <Button variant="outline" onClick={reset}>
            Reset
          </Button>
          <Button variant="primary" onClick={increment}>
            Increase
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default Counter;
