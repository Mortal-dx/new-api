/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

import { TAG_STYLES } from '../constants'
import { isInternalNet } from '../lib/ip-utils'
import type { IpAuditRow } from '../types'

function Tag({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap',
        className
      )}
    >
      {children}
    </span>
  )
}

/** Neutral network tag with a colored dot: internal = blue, external = red. */
export function NetTypeTag({ netType }: { netType: string }) {
  const { t } = useTranslation()
  const internal = isInternalNet(netType)
  return (
    <Tag className={TAG_STYLES.net}>
      <span
        className={cn(
          'size-1.5 rounded-full',
          internal ? 'bg-green-600' : 'bg-red-600'
        )}
      />
      {internal ? t('Internal') : t('External')}
    </Tag>
  )
}

/**
 * Status tags for one audit row, mirroring the frozen prototype:
 * hit wins over whitelist; a "new" row is pending or handled; everything
 * else that is neither new nor listed is existing.
 */
export function StatusTags({ row }: { row: IpAuditRow }) {
  const { t } = useTranslation()

  const pending = row.is_new && !row.white && !row.handled
  const handled = row.is_new && !row.white && row.handled
  const existing = !row.hit && !row.white && !row.is_new

  return (
    <span className='flex flex-wrap items-center gap-1'>
      {row.hit && <Tag className={TAG_STYLES.hit}>🚫 {t('Blacklist')}</Tag>}
      {row.white && <Tag className={TAG_STYLES.white}>✅ {t('Whitelist')}</Tag>}
      {handled && <Tag className={TAG_STYLES.handled}>{t('New · Handled')}</Tag>}
      {pending && <Tag className={TAG_STYLES.new}>★ {t('New Pending')}</Tag>}
      {existing && <Tag className={TAG_STYLES.exist}>{t('Existing')}</Tag>}
    </span>
  )
}
