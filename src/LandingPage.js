import React, { useState, useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';

function LandingPage() {

    const [dateRanges, setDateRanges] = useState([{ start: '', end: '' }]);
    const [aliyahDate, setaliyahDate] = useState('');


    const updateDateRange = (index, startOrEnd, date) => {
        const newDateRanges = [...dateRanges];
        newDateRanges[index][startOrEnd] = date;
        setDateRanges(newDateRanges);
    };

    const addRanges = () => {
        let fullyFilled = 0;
        dateRanges.forEach((range, index) => {
            fullyFilled += (range.start && range.end) ? 1 : 0;
        });
        if (dateRanges.length === 0 || fullyFilled === dateRanges.length) {
            setDateRanges([...dateRanges, { start: '', end: '' }]);
        }
    };

    const removeRanges = () => {
        for (let i = 0; i < dateRanges.length - 1; i++) {
            const range = dateRanges[i];
            if (!range.start && !range.end) {
                removeRange(i);
            }
        }
        let fullyFilled = 0;
        dateRanges.forEach((range, index) => {
            fullyFilled += (range.start && range.end) ? 1 : 0;
        });
        if (!dateRanges[dateRanges.length - 1].start && !dateRanges[dateRanges.length - 1].end && fullyFilled < dateRanges.length - 1) {
            removeRange(dateRanges.length - 1);
        }
    };

    const removeRange = (index) => {
        const newDateRanges = [...dateRanges];
        newDateRanges.splice(index, 1);
        setDateRanges(newDateRanges);
    };

    const calculateDaysInside = (daysAbroad) => {
        const totalDays = Math.ceil((Date.now() - new Date(aliyahDate)) / 1000 / 60 / 60 / 24);
        return totalDays - daysAbroad;
    };

    const calculateDaysAbroad = () => {
        let totalDays = 0;
        dateRanges.forEach(range => {
            if (range.start && range.end) {
                const start = new Date(range.start);
                const end = new Date(range.end);
                const diffTime = Math.abs(end - start);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                totalDays += diffDays;
            }
        });
        return totalDays + 1;
    };

    const calculateDarkonStats = () => {
        if (!aliyahDate) {
            return {};
        }
        const Aliyah = new Date(aliyahDate);
        const AliyahPlusYear = new Date(aliyahDate).setFullYear(Aliyah.getFullYear() + 1);
        const daysAbroad = calculateDaysAbroad();
        const daysInside = calculateDaysInside(daysAbroad);
        const totalDaysSinceAliyah = daysAbroad + daysInside;
        var freeDays = 0;
        var dateSinceDarkonAvailable;
        const daysPeriod = Math.max(365, totalDaysSinceAliyah);
        const daysThreshold = Math.ceil(3 * daysPeriod / 4.0)
        if (daysInside >= daysThreshold) { // набрали 3/4 дней
            freeDays = Infinity;
            dateSinceDarkonAvailable = maxDate(AliyahPlusYear + 1, Date.now());
        } else if (totalDaysSinceAliyah < daysPeriod
            && daysPeriod - totalDaysSinceAliyah + daysInside >= daysThreshold) { // еще можем набрать 3/4 дней 
            freeDays = daysPeriod - daysThreshold - (totalDaysSinceAliyah - daysInside);
            dateSinceDarkonAvailable = AliyahPlusYear + 1;
        } else { // можем набрать 3/4 дней только компенсируя доп. днями
            freeDays = 0;
            const overspentDays = -(daysPeriod - daysThreshold - (daysPeriod - daysInside));
            dateSinceDarkonAvailable = AliyahPlusYear + 1 + overspentDays * 3;
        }
        return {
            daysAbroad: daysAbroad,
            daysInside: daysInside,
            freeDays: freeDays,
            dateSinceDarkonAvailable: dateSinceDarkonAvailable
        };
    }


    const maxDate = (date1, date2) => {
        return date1 > date2 ? date1 : date2;
    }

    function formatDate(date) {
        if (!date) return "";

        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('.');
    }

    const inputDatesComponent = () => {
        return (
            <div>
                <h1>5 year Darkon calculator</h1>
                <h2>Aliyah Date</h2>
                <label>
                    <DatePicker
                        value={aliyahDate}
                        onChange={e => setaliyahDate(e.target.value)}
                    />
                </label>
                <h2>Days Abroad</h2>
                {dateRanges.map((range, index) => (
                    <div key={index}>
                        <DatePicker
                            value={range.start || ''}
                            onChange={e => updateDateRange(index, 'start', e)}
                            maxDate={range.end || ''}
                        />
                        <DatePicker
                            value={range.end || ''}
                            onChange={e => updateDateRange(index, 'end', e)}
                            minDate={range.start || ''}
                        />
                    </div>
                ))}
                <Button color="success" size="large" variant="contained">Calculate</Button>
            </div>
        );
    }

    return (
        <div>
            <h1>Darkon Calculator</h1>
            <div>
                <div>To get Darkon Passport for 5 years you have to spend in Israel at least 75% of your time since your Aliyah date</div>
                <div>This tool calculates when you can get your passport and how may days you have abroad to plan your vacations and business trips carefully</div>
            </div>
            <Button color="success" size="large" variant="contained">Buy me a coffee!</Button>
            <div>
                {inputDatesComponent()}
                <img src={require('./Darkon.png')} alt="Static Image" style={{ padding: '0 200px 0 0', width: '500px' }} />
            </div>
        </div >
    );
}

export default LandingPage;