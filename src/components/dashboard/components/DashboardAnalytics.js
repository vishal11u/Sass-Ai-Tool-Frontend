import React from 'react';
import IncomeExp from './sub-charts/IncomeExp';
import DrHospShare from './sub-charts/DrHospShare';
import PaymentType from './sub-charts/PaymentType';
import IPDIncome from './sub-charts/IPDIncome';
import OPDIncome from './sub-charts/OPDIncome';

function DashboardAnalytics() {
    return (
        <div>
            <div className=''>
                <h1 className='text-[20px] font-semibold'>
                    <span className=''>Dashboard Analytics</span>
                </h1>
            </div>
            <div className='flex items-center justify-between'>
                <DrHospShare />
                <IPDIncome />
                <OPDIncome />
            </div>
            <div className='flex items-center justify-between'>
                <IncomeExp />
                <PaymentType />
            </div>
        </div>
    )
}

export default DashboardAnalytics;