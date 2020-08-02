import React from 'react';
import styles from './TeamRetreival.module.css';

function TeamRetreival({name}) {
    
    const arr = name.split(' ');
    let abbr = '';
    arr.forEach(element => {
    abbr += element.charAt(0);
    });
    return <div className={styles.circle}>{abbr}</div>;
}

export default TeamRetreival
