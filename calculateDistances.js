function calculateDistances(cablePoints, trackIndex) {
            const equations = equationsPerTrack[activeTrackIndex];

            cablePoints.forEach((point, index) => {
                let minDistance = Infinity;
                let closestEquation = '';
                let closestPoint = { x: 0, y: 0 };
                pointCounter = index;
                
                for (const [key, eq] of Object.entries(equations)) {
                    const { m, n, x1, x2, y1, y2 } = eq;
                    const minX = Math.min(x1, x2);
                    const maxX = Math.max(x1, x2);
                    const minY = Math.min(y1, y2);
                    const maxY = Math.max(y1, y2);

                    if (point.x >= Math.min(x1, x2) && point.x <= Math.max(x1, x2)) {
                        const perpendicularX = (point.x + m * point.y - m * n) / (m * m + 1);
                        const perpendicularY = (m * point.x + (m * m * point.y) + n) / (m * m + 1);

                        if (perpendicularX >= minX && perpendicularX <= maxX && perpendicularY >= minY && perpendicularY <= maxY) {
                            const distance = Math.abs(m * point.x - point.y + n) / Math.sqrt(m * m + 1);
                            if (distance < minDistance) {
                                minDistance = distance;
                                closestEquation = key;
                                closestPoint = { x: perpendicularX, y: perpendicularY };
                            }
                        }
                    }
                }

                if (minDistance == Infinity) {
                    console.log(`Kein passender Punkt für Punkt ${index + 1} (${point.x}, ${point.y}) gefunden.`);
                    
                    let distances =  [];
                    for (const track of allTracks) {
                        for (const trackPoint of track) {
                            distances.push({
                                    dist: Math.sqrt(Math.pow(point.x - trackPoint.x, 2) + Math.pow(point.y - trackPoint.y, 2)), 
                                    trackX:trackPoint.x, 
                                    trackY:trackPoint.y 
                                }
                            );
                        }
                    }
                    distances.sort((a, b) => a.dist - b.dist);
                    minDistance = distances[0].dist;
                    closestPoint = { x: distances[0].trackX, y: distances[0].trackY };

                    console.log(distances);
                    const dx = point.x - closestPoint.x;
                    const dy = point.y - closestPoint.y;
                    const m = dy / dx || 0; // Absicherung gegen Division durch 0
                    const n = closestPoint.y - m * closestPoint.x;

                    // Verwende temporären Schlüssel für die Gleichung
                    closestEquation = `temp_${index}`;
                    equations[closestEquation] = {
                        m: m,
                        n: n,
                        x1: closestPoint.x,
                        y1: closestPoint.y,
                        x2: point.x,
                        y2: point.y
                    }
                }

                const distanceInMeters = (minDistance * distanceScale); // Abstand in Metern
                console.log(`Minimale Entfernung des Punktes ${index + 1} (${point.x}, ${point.y}) zu Gleichung ${closestEquation}: ${distanceInMeters} Meter an Punkt (${closestPoint.x.toFixed(2)}, ${closestPoint.y.toFixed(2)})`);
                info.innerHTML += `<br>Punkt ${index + 1}: Abstand zu ${closestEquation} = ${distanceInMeters.toFixed(2)} Meter`;

                const equationIndex = parseInt(closestEquation.replace('y', ''), 10); // Index der Gleichung
                console.log(equationIndex);
                const startFunctionDistance = startDistance + (equationIndex - 1) * 0.1; // Startkilometer der aktuellen Funktion
                const eq = equations[closestEquation];
                const { x1, y1, x2, y2 } = eq;

                // Berechne die Distanz entlang der Funktion zwischen den beiden Endpunkten
                const functionLength = getDistance(x1, y1, x2, y2); // Distanz zwischen Start- und Endpunkt der Funktion in Metern

                // Berechne den Abstand vom Startpunkt der Funktion zum closestPoint
                const closestPointDistanceOnFunction = getDistance(x1, y1, closestPoint.x, closestPoint.y);

                // Berechne den Anteil der Distanz des closestPoint an der gesamten Funktion
                const percentageOfFunction = closestPointDistanceOnFunction / functionLength; // Anteil in Prozent

                // Berechne den genauen Kilometer auf der Funktion
                const closestPointDistanceOnTrack = startFunctionDistance + (percentageOfFunction * 0.1);

                console.log(`Der nächste Punkt befindet sich bei Kilometer: ${closestPointDistanceOnTrack.toFixed(5)}`);

                info.innerHTML += `<br>Punkt ${index + 1}: Abstand zu ${closestEquation} = ${distanceInMeters.toFixed(2)} Meter (Kilometer: ${closestPointDistanceOnTrack.toFixed(5)})`;

                drawPerpendicularLine(point, closestPoint, onscreenCtx);

                if (pointCounter === 1) {
                    // Wenn der PunktCounter größer als 1 ist, haben wir mindestens 2 Punkte
                    // Den letzten Messpunkt als Endpunkt des aktuellen Teilstücks setzen
                    endKm.push(closestPointDistanceOnTrack);
                    endAbst.push(distanceInMeters);

                } else if (pointCounter === 0) {
                    // Wenn nur ein Punkt vorhanden ist, haben wir noch kein Teilstück
                    // Initialisiere das erste Teilstück
                    startKm.push(closestPointDistanceOnTrack);
                    startAbst.push(distanceInMeters);
                } else if (pointCounter > 1) {
                    endKm.push(closestPointDistanceOnTrack);
                    endAbst.push(distanceInMeters);
                    startKm.push(endKm[endKm.length - 2]);
                    startAbst.push(endAbst[endAbst.length - 2]);
                }

                console.log(endKm);
                console.log(startKm);
                console.log(endAbst);   

                pointCounter++;
            });

            exportData = [];
            fillexportData();
            const teiltrasseWerte = getTeiltrasseWerte();
            renderExportDataToTable(exportData, teiltrasseWerte);
            console.log(exportData);
        }