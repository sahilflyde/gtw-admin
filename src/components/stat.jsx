import { Badge } from '../components/badge'
import { Divider } from '../components/divider'


export function Stat({ title, value, change, isLoading }) {
  return (
    <div>

      
      <Divider />
      <div className="mt-6 text-lg/6 font-medium text-zinc-900 dark:text-zinc-100 sm:text-sm/6">
        {title}
      </div>

      <div className="mt-3 text-3xl/8 font-semibold text-zinc-900 dark:text-white sm:text-2xl/8">
        {isLoading ? (
          <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-700 animate-pulse rounded" />
        ) : (
          value
        )}
      </div>

      {change && (
        <div className="mt-3 text-sm/6 sm:text-xs/6">
          <Badge color={change.startsWith('+') ? 'lime' : 'pink'}>{change}</Badge>{' '}
          <span className="text-zinc-500 dark:text-zinc-400">from last week</span>
        </div>
      )}
    </div>
  );
}