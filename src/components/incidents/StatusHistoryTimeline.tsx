import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { StatusChip } from '../common/StatusChip';
import { useUsers } from '../../hooks/useUsers';
import { formatDateTime } from '../../utils/dateUtils';
import type { StatusHistoryEntry, User } from '../../api/types';

interface StatusHistoryTimelineProps {
  history: StatusHistoryEntry[];
}

export function StatusHistoryTimeline({ history }: StatusHistoryTimelineProps) {
  const { data: users } = useUsers();

  // Create a lookup map for user names
  const userMap = useMemo(() => {
    const map = new Map<string, User>();
    users?.forEach((user) => map.set(user.id, user));
    return map;
  }, [users]);

  const getUserName = (userId: string): string => {
    const user = userMap.get(userId);
    return user?.name ?? 'Unknown';
  };

  if (history.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No status history available
      </Typography>
    );
  }

  // Display in reverse chronological order (most recent first)
  const sortedHistory = [...history].reverse();

  return (
    <List dense disablePadding>
      {sortedHistory.map((entry, index) => (
        <ListItem
          key={`${entry.status}-${entry.changedAt}`}
          disableGutters
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            py: 1,
            borderLeft: '2px solid',
            borderColor: index === 0 ? 'primary.main' : 'grey.300',
            pl: 2,
            ml: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <StatusChip status={entry.status} size="small" />
          </Box>
          <ListItemText
            primary={
              <Typography variant="body2" color="text.secondary">
                Changed by {getUserName(entry.changedBy)}
              </Typography>
            }
            secondary={formatDateTime(entry.changedAt)}
            secondaryTypographyProps={{ variant: 'caption' }}
          />
        </ListItem>
      ))}
    </List>
  );
}
