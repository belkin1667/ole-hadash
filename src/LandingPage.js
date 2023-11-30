import React, { useState, useEffect } from 'react';

function LandingPage() {
    const [dateRanges, setDateRanges] = useState([{ start: '', end: '' }]);
    const [alyaDate, setAlyaDate] = useState('');

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
        if (dateRanges.length == 0 || fullyFilled == dateRanges.length) {
            setDateRanges([...dateRanges, { start: '', end: '' }]);
        }
    };

    const removeRanges = () => {
        for (let i = 0; i < dateRanges.length - 1; i++) {
            const range = dateRanges[i];
            if (!range.start && !range.end) {
                const newDateRanges = [...dateRanges];
                newDateRanges.splice(i, 1);
                setDateRanges(newDateRanges);
            }
        }
        let fullyFilled = 0;
        dateRanges.forEach((range, index) => {
            fullyFilled += (range.start && range.end) ? 1 : 0;
        });
        if (!dateRanges[dateRanges.length - 1].start && !dateRanges[dateRanges.length - 1].end && fullyFilled < dateRanges.length - 1) {
            const newDateRanges = [...dateRanges];
            newDateRanges.splice(dateRanges.length - 1, 1);
            setDateRanges(newDateRanges);
        }
    };

    useEffect(addRanges, [dateRanges]);
    useEffect(removeRanges, [dateRanges]);

    const calculateDaysInside = (daysAbroad) => {
        const totalDays = Math.ceil((Date.now() - new Date(alyaDate)) / 1000 / 60 / 60 / 24);
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
        return totalDays;
    };

    const calculateDarkonStats = () => {
        if (!alyaDate) {
            return {};
        }
        const alya = new Date(alyaDate);
        const alyaPlusYear = new Date(alyaDate).setFullYear(alya.getFullYear() + 1);
        const daysAbroad = calculateDaysAbroad();
        const daysInside = calculateDaysInside(daysAbroad);
        const totalDaysSinceAlya = daysAbroad + daysInside;
        var freeDays = 0;
        var dateSinceDarkonAvailable;
        const daysPeriod = Math.max(365, totalDaysSinceAlya);
        const daysThreshold = Math.ceil(3 * daysPeriod / 4.0)
        if (daysInside >= daysThreshold) { // набрали 3/4 дней
            freeDays = Infinity;
            dateSinceDarkonAvailable = maxDate(alyaPlusYear + 1, Date.now());
        } else if (totalDaysSinceAlya < daysPeriod
            && daysPeriod - totalDaysSinceAlya + daysInside >= daysThreshold) { // еще можем набрать 3/4 дней 
            freeDays = daysPeriod - daysThreshold - (totalDaysSinceAlya - daysInside);
            dateSinceDarkonAvailable = alyaPlusYear + 1;
        } else { // можем набрать 3/4 дней только компенсируя доп. днями
            freeDays = 0;
            const overspentDays = -(daysPeriod - daysThreshold - (daysPeriod - daysInside));
            dateSinceDarkonAvailable = alyaPlusYear + 1 + overspentDays * 3;
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

    return (
        <div>
            <h1>5 year Darkon calculator</h1>
            <h2>Alya Date</h2>
            <label>
                <input
                    type="date"
                    value={alyaDate}
                    onChange={e => setAlyaDate(e.target.value)}
                />
            </label>
            <h2>Days Abroad</h2>
            {dateRanges.map((range, index) => (
                <div key={index}>
                    <input
                        type="date"
                        value={range.start || ''}
                        onChange={e => updateDateRange(index, 'start', e.target.value)}
                        max={range.end}
                    />
                    <input
                        type="date"
                        value={range.end || ''}
                        onChange={e => updateDateRange(index, 'end', e.target.value)}
                        min={range.start}
                    />
                </div>
            ))}
            <h3>Total days abroad: {calculateDarkonStats().daysAbroad}</h3>
            <h3>Total days inside: {calculateDarkonStats().daysInside}</h3>
            <h3>Days abroad left: {calculateDarkonStats().freeDays}</h3>
            <h3>Date since 5 year Darkon available: {formatDate(calculateDarkonStats().dateSinceDarkonAvailable)}</h3>
        </div>
    );
}

export default LandingPage;