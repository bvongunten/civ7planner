import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonModule, NgClass} from '@angular/common';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatGridList} from '@angular/material/grid-list';

interface Leader {
  id: string;
  name: string;

}

interface Civilization {
  id: string;
  name: string;

  historic: string[]
  geographic: string[]
  strategic: string[]

  unlockedByLeader: string[]

  unlockedByCivilizations: string[]

  unlockedByConditions: string[]

}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NgClass, MatCard, MatCardContent, MatFormField, MatLabel, MatSelect, MatOption, MatGridList],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  leaders: Leader[] = [];
  antiquityCivs: Civilization[] = [];
  explorationCivs: Civilization[] = [];
  modernCivs: Civilization[] = [];

  selectedLeader: Leader | null = null;
  selectedAntiquityCiv: Civilization | null = null;
  selectedExplorationCiv: Civilization | null = null;
  selectedModernCiv: Civilization | null = null;


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.selectedLeader = null;

    this.http.get<Leader[]>('/leaders/leaders.json').subscribe({
      next: (data) => {
        this.leaders = data.sort((a, b) => a.name.localeCompare(b.name));
      },
      error: (err) => console.error('Failed to load leaders:', err),
    });


    this.http.get<Civilization[]>('/antiquity/antiquity.json').subscribe({
      next: (data) => {
        this.antiquityCivs = data.sort((a, b) => a.name.localeCompare(b.name));
      },
      error: (err) => console.error('Failed to load anitquity civs:', err),
    });

    this.http.get<Civilization[]>('/exploration/exploration.json').subscribe({
      next: (data) => {
        this.explorationCivs = data.sort((a, b) => a.name.localeCompare(b.name));
      },
      error: (err) => console.error('Failed to load exploration civs:', err),
    });

    this.http.get<Civilization[]>('/modern/modern.json').subscribe({
      next: (data) => {
        this.modernCivs = data.sort((a, b) => a.name.localeCompare(b.name));
      },
      error: (err) => console.error('Failed to load modern civs:', err),
    });

  }

  selectLeader(leader: Leader): void {
    this.selectedLeader = leader;

    this.selectedAntiquityCiv = null;
    this.selectedExplorationCiv = null;
    this.selectedModernCiv = null;
  }

  selectAntiquityCiv(antiquity: Civilization): void {
    this.selectedAntiquityCiv = antiquity;

    this.selectedExplorationCiv = null;
    this.selectedModernCiv = null;
  }

  selectExplorationCiv(exploration: Civilization): void {
    this.selectedExplorationCiv = exploration;

    this.selectedModernCiv = null;
  }

  selectModernCiv(modern: Civilization): void {
    this.selectedModernCiv = modern;
  }

  public unlockCheck(civilization: Civilization) {
    let result = '';

    if (civilization.geographic?.includes(<string>this.selectedLeader?.id)) {
      result += '✔ Geographic <br>';
    }

    if (civilization.strategic?.includes(<string>this.selectedLeader?.id)) {
      result += '✔ Strategic <br>';
    }

    if (civilization.historic?.includes(<string>this.selectedLeader?.id)) {
      result +=  '✔ Historic <br>';
    }

    if (civilization.unlockedByCivilizations?.includes(<string>this.selectedAntiquityCiv?.id)) {
      result +=  '✔ Unlocked by <b>' + this.selectedAntiquityCiv?.name + '</b><br>';
    }

    if (civilization.unlockedByCivilizations?.includes(<string>this.selectedExplorationCiv?.id)) {
      result += '✔ Unlocked by <b>' + this.selectedExplorationCiv?.name + '</b><br>';
    }

    if (civilization.unlockedByLeader?.includes(<string>this.selectedLeader?.id)) {
      result += '✔ Unlocked by <b>' + this.selectedLeader?.name + '</b><br>';
    }

    return result;
  }

  public isCivilizationUnlocked(civilization: Civilization | null) {
    return civilization && this.unlockCheck(civilization) == '';
  }

  public getCivilizationUnlockConditions(civilization: Civilization | null) {
    if (civilization && civilization.unlockedByConditions) {
       return civilization.name + ' needs be unlocked by following conditions: ' + civilization.unlockedByConditions.map(condition => `<b>${condition}</b>`).join(' or ');;
    } else {
      return '';
    }
  }



}
