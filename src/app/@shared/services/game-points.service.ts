import { Injectable } from "@angular/core";
import { Firestore, orderBy, where } from "@angular/fire/firestore";
import { GamePointsScores } from "app/@shared/interface/game-points-scores";
import { PlayersService } from "app/@shared/services/players.service";
import { getPastTimestampDate } from "app/@shared/utils/date.utils";
import { addDoc, collection, getDocs, query, Timestamp } from 'firebase/firestore'

@Injectable({
  providedIn: 'root',
})
export class GamePointsService {
  private readonly SixQuiPrendCollection;
  private readonly HiloCollection;

  constructor(private firestore: Firestore, private playersService: PlayersService) {
    this.SixQuiPrendCollection = collection(this.firestore, 'SixQuiPrend');
    this.HiloCollection = collection(this.firestore, 'hilo');
  }

  async saveGame(scores: GamePointsScores, game: string): Promise<void> {
    const collection = this.getCollection(game);
    console.log('collection', collection)
    await addDoc(collection, scores);
  }

  async getScoresFromLastXDays(game: string, days: number = 31): Promise<GamePointsScores[]> {
    const collection = this.getCollection(game);
    const startDate: Timestamp = getPastTimestampDate(days)
    const querySnapshot = await getDocs(query(
      collection,
      where('date', '>=', startDate),
      orderBy('date', 'desc')
    ))
    return querySnapshot.docs.map(
      doc => (
        doc.data() as GamePointsScores
      ))
  }

  private getCollection(game: string){
    if (game === 'Hilo'){
      return this.HiloCollection;
    }
    return this.SixQuiPrendCollection;
  }
}
