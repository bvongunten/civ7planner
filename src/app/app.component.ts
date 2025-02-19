import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';


interface Leader {
  id: string;
  name: string;

  cultural: boolean
  diplomatic: boolean
  economic: boolean
  expansionist: boolean
  militaristic: boolean
  scientific: boolean

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

  cultural: boolean
  diplomatic: boolean
  economic: boolean
  expansionist: boolean
  militaristic: boolean
  scientific: boolean

}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatRadioGroup, MatRadioButton],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  leaders: Leader[] = [];
  filteredLeaders: Leader[] = [];
  antiquityCivs: Civilization[] = [];

  filteredAntiquityCivs: Civilization[] = [];


  explorationCivs: Civilization[] = [];
  filteredExplorationCivs: Civilization[] = [];
  modernCivs: Civilization[] = [];
  filteredModernCivs: Civilization[] = [];

  selectedLeader: Leader | null = null;
  selectedAntiquityCiv: Civilization | null = null;
  selectedExplorationCiv: Civilization | null = null;
  selectedModernCiv: Civilization | null = null;

  selectedFilter: string = 'all';

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.selectedLeader = null;

    this.http.get<Leader[]>('./leaders/leaders.json').subscribe({
      next: (data) => {
        this.leaders = data.sort((a, b) => a.name.localeCompare(b.name));
        this.filteredLeaders = this.leaders;
      },
      error: (err) => console.error('Failed to load leaders:', err),
    });


    this.http.get<Civilization[]>('./antiquity/antiquity.json').subscribe({
      next: (data) => {
        this.antiquityCivs = data.sort((a, b) => a.name.localeCompare(b.name));
        this.filteredAntiquityCivs = this.antiquityCivs;

      },
      error: (err) => console.error('Failed to load anitquity civs:', err),
    });

    this.http.get<Civilization[]>('./exploration/exploration.json').subscribe({
      next: (data) => {
        this.explorationCivs = data.sort((a, b) => a.name.localeCompare(b.name));
        this.filteredExplorationCivs = this.explorationCivs;
      },
      error: (err) => console.error('Failed to load exploration civs:', err),
    });

    this.http.get<Civilization[]>('./modern/modern.json').subscribe({
      next: (data) => {
        this.modernCivs = data.sort((a, b) => a.name.localeCompare(b.name));
        this.filteredModernCivs = this.modernCivs;
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
      result += '✔ Historic <br>';
    }

    if (civilization.unlockedByCivilizations?.includes(<string>this.selectedAntiquityCiv?.id)) {
      result += '✔ Unlocked by <b>' + this.selectedAntiquityCiv?.name + '</b><br>';
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
      return civilization.name + ' needs be unlocked by following condition(s): ' + civilization.unlockedByConditions.map(condition => `<b>${condition}</b>`).join(' / ');
    } else {
      return '';
    }
  }

  public getAttributes(entity: any): string {
    let result = '';

    if (entity.cultural) result += 'Cultural / ';
    if (entity.economic) result += 'Economic / ';
    if (entity.diplomatic) result += 'Diplomatic / ';
    if (entity.expansionist) result += 'Expansionist / ';
    if (entity.militaristic) result += 'Militaristic / ';
    if (entity.scientific) result += 'Scientific / ';

    return result ? result.slice(0, -3) : result;
  }


  onFilterChange(event: any) {
    this.selectedFilter = event.value;
    this.filterLists();
  }

  filterLists() {

    if (this.selectedFilter == 'all') {
      this.filteredLeaders = [...this.leaders];
      this.filteredAntiquityCivs = [...this.antiquityCivs];
      this.filteredExplorationCivs = [...this.explorationCivs];
      this.filteredModernCivs = [...this.filteredModernCivs];


    } else {

      const key = this.selectedFilter as keyof Leader;
      this.filteredLeaders = this.leaders.filter(leader => leader[key] === true);

      // Filter civs too ?
      /**
      const civKey = this.selectedFilter as keyof Civilization;
      this.filteredAntiquityCivs = this.antiquityCivs.filter(civ => civ[civKey] === true);
      this.filteredExplorationCivs = this.explorationCivs.filter(civ => civ[civKey] === true);
      this.filteredModernCivs = this.modernCivs.filter(civ => civ[civKey] === true);
      */
    }

    this.selectedLeader = null;
    this.selectedAntiquityCiv = null;
    this.selectedExplorationCiv = null;
    this.selectedModernCiv = null;

  }

}
