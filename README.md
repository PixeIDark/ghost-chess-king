1. 기물 클래스 생각해보기
   - "클래스 상속"은 서버-클라이언트 공유의 적입니다          
   우리는 지금 모노레포를 만들고 있습니다. shared에 있는 코드를 클라이언트(React)와 서버(Node.js)가 같이 써야 합니다.                
   문제: 서버에서 DB에 저장된 체스 상태를 클라이언트로 보낼 때, 클래스 인스턴스는 순수한 JSON으로 변환됩니다. 이때 getValidMoves() 같은 메서드는 증발합니다.            
   불편함: 클라이언트는 받은 데이터를 다시 new Pawn(), new Rook()으로 일일이 복구(Hydration)해야 합니다. 기물이 32개라면 매번 32번의 인스턴스 생성이 일어납니다. 반면, 함수형 데이터 구조는 그냥 받아서 바로 쓰면 끝입니다.
   - "다형성"의 함정: 체스는 기물 혼자 결정할 수 없습니다             
   클로드는 "기물 클래스 안에 이동 로직을 넣으라"고 하지만, 실제 체스 규칙은 기물 클래스 안에 가둘 수 없습니다.           
   캐슬링: 룩(Rook) 클래스 안에 로직을 넣으려 해도, 킹(King)이 움직였는지, 사이 칸이 공격받고 있는지 알려면 결국 Board 전체와 History를 인자로 넘겨받아야 합니다.       
   앙파상: 폰(Pawn) 클래스가 "나 지금 앙파상 가능해?"라고 판단하려면 **직전의 상대방 수(Last Move)**를 알아야 합니다. 결국 piece.getValidMoves(board, history, lastMove, castlingRights...) 처럼 인자가 주렁주렁 달리게 됩니다. 이럴 거면 로직을 기물 안에 둘 이유가 전혀 없습니다.
   - "성능과 직렬화": FEN과의 호환성            
   체스의 표준 언어는 FEN(문자열)입니다.                
   모든 체스 엔진(Stockfish 등)과 통신할 때 FEN을 쓰는데, 클래스 기반 설계는 FEN으로 변환하고 다시 클래스로 만드는 과정에서 불필요한 비용이 발생합니다.            
   데이터 중심 설계는 FEN 문자열 자체가 곧 상태이기 때문에, 변환 로직이 훨씬 가볍고 빠릅니다.
2. 통합 테스트 코드 작성하기
3. 배포하기
4Game 페이지 리팩토링

Player 시스템 
Base 클래스: Player (이름, 색상 보유)
Sub 클래스: AIPlayer (상속), HumanPlayer (상속)
Deep Sub 클래스: StockfishAI (AIPlayer 상속), AlphaZeroAI (AIPlayer 상속)

GameMode 시스템
Base: ChessGame (기본 기물 배치, 턴 관리)
Sub: GhostChess (상속 - 기물이 투명해지는 특수 능력 추가)
Deep Sub: RankedGhostChess (GhostChess 상속 - 점수 계산 로직 추가)

MoveEffect (이동 효과) 시스템
Base: Effect (애니메이션 재생 시간, 좌표)
Sub: CombatEffect (전투 발생 시 효과)
Deep Sub: CriticalSlash (치명타 효과 - Ninja 스타일!), SmokeBomb (연막 효과)