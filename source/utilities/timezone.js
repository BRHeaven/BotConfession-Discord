import dayjs from 'dayjs';
export const getVietnamTime = () => {
    return dayjs().add(7, 'hour').toDate();
};