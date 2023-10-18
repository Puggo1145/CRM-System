import { useEffect, useState } from 'react';
import makeRequest from '../../../../utils/makeRequest'
import { Link } from 'react-router-dom'

import { schoolDataType } from '../../../../types/createDataModeltype'

import useUrl from '../../../../store/urls'

export default function SchoolData() {

    const backendUrl = useUrl(state => state.backendUrl);
    const [schools, setSchools] = useState<schoolDataType[]>([]);

    useEffect(() => {
        (async () => {
            const res = await makeRequest({
                method: 'GET',
                url: `${backendUrl}/api/v1/data/schools`
            });

            if (!('error' in res)) {
                setSchools(res.data.data.schools);
            }
        })();
    }, [])

    return (
        <div className='database-content-data'>
            {
                schools.map(school => {
                    return (
                        <Link 
                            className='database-content-data-item' 
                            key={school.school_id} 
                            to={`/dashboard/database/${school.school_name}?${school.school_id}`}
                        >
                            <h3>{school.school_name}</h3>
                        </Link>
                    )
                })
            }
        </div>
    )
}
